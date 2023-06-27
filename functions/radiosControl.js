exports = async function (payload) {

  const databaseCollection = `radios`
  var action
  let operationName
  var databaseAction
  var databaseQuery
  var databaseFilter
  let operationParameters = {}
  var processedRequestData

  /**
    * Processa a requisição: Decodifica os dados e depois tranforma em formato JSON
    */
  try {
    processedRequestData = await context.functions.execute(`proccessRequest`, payload)
  } catch (error) {
    return { success: false, data: error }
  }

  //   processedRequestData = {
  //     "headers": {
  //         "Accept": [
  //             "*/*"
  //         ],
  //         "Postman-Token": [
  //             "6a9b9513-8152-41d3-a0d4-b84227a09a4b"
  //         ],
  //         "Content-Length": [
  //             "287"
  //         ],
  //         "X-Forwarded-For": [
  //             "200.181.33.155"
  //         ],
  //         "X-Forwarded-Proto": [
  //             "https"
  //         ],
  //         "X-Envoy-External-Address": [
  //             "200.181.33.155"
  //         ],
  //         "X-Cluster-Client-Ip": [
  //             "200.181.33.155"
  //         ],
  //         "Content-Type": [
  //             "application/json"
  //         ],
  //         "Accept-Encoding": [
  //             "gzip, deflate, br"
  //         ],
  //         "X-Request-Id": [
  //             "98cb09e3-4085-44c3-bb03-cd87bbc4dab0"
  //         ],
  //         "X-Forwarded-Client-Cert": [
  //             "By=spiffe://xgen-prod/ns/baas-prod/sa/baas-main;Hash=c68c5aa61293af7317ce95a81111deb355d7f6acdfabeb775e95a468d14f947a;Subject=\"O=MongoDB\\, Inc.,CN=lb-b\";URI=spiffe://xgen-prod/ns/vm-prod/sa/lb-b"
  //         ],
  //         "User-Agent": [
  //             "PostmanRuntime/7.32.3"
  //         ]
  //     },
  //     // "urlParameters": {
  //     //     "action": "changeClient"
  //     // },
  //     // "body": {
  //     //     "mac": "000000000000000",
  //     //     "clientId": "6494b3cd9fdaaf633f672872",
  //     //     "name": "XXX_LRDFT0003",
  //     //     "hardwareVersion": "1.0.0",
  //     //     "firmwareVersion": "370223360",
  //     //     "ProfileId": "",
  //     //     "manufacturerId": "",
  //     //     "userId": "64920b1cbf0f6a848f4f8220"
  //     // },
  //     "urlParameters": {
  //         "action": "getNewNumber"
  //     },
  //     "body": {
  //         "mac": "000000000000000",
  //         "clientId": "6494b3cd9fdaaf633f672872",
  //         "deviceName": "XXX_LRMATFFFE967F3E"
  //     }
  // }
  /**
   * Ao atualizar um rádio a resposta vai ser o cliente desse rádio com o resumo de dispositivos atualizado
   */
  try {
    await context.functions.execute(`radiosValidation`, processedRequestData)
  } catch (error) {
    return { success: false, data: error }
  }

  /**
   * Executa algum tratamento antes, se necessário, e depois faz a operação com o Banco de Dados
   */
  action = processedRequestData.urlParameters.action
  databaseQuery = processedRequestData.body

  switch (action) {
    case 'create':
      databaseAction = 'insertOne';
      break;

    case 'findOne':
      databaseAction = 'findOne';
      break;

    case 'findAll':
      operationName = 'findMany';
      operationParameters = {};
      break;

    case 'findMany':
      operationName = 'findMany';
      if (payload.body == undefined || payload.body == null) {
        throw "É necessário fornecer informações válidas para pesquisar no Banco de Dados! (1)"
      }

      try {
        operationParameters = JSON.parse(payload.body.text())
      } catch (e) {
        throw "É necessário fornecer informações válidas (array) para pesquisar no Banco de Dados! (3)"
      }
      break;

    case 'updateOne':
      operationName = 'databaseUpdateOne';
      break;

    case 'excludeOne':
      operationName = 'databaseExcludeOne';
      break;

    case 'deleteOne':
      operationName = 'databaseDeleteOne';
      break;

    case 'insertMany':

      if (payload.body == undefined) {
        throw "É necessário fornecer informações válidas para inserir no Banco de Dados! (1)"
      }

      if (payload.body == null) {
        throw "É necessário fornecer informações válidas para inserir no Banco de Dados! (2)"
      }

      try {
        operationParameters = JSON.parse(payload.body.text())
      } catch (e) {
        throw "É necessário fornecer informações válidas (array) para inserir no Banco de Dados! (3)"
      }
      operationName = 'radiosInsertMany';
      break;

    case 'getNewNumber':
      try {
        return { success: true, data: await getRadioNumber(processedRequestData.body) }
      } catch (error) {
        return { success: false, data: `Erro ao obter numeração do dispositivo: ${error}` }
      }
      break;
    case 'changeClient':
      try {
        return { success: true, data: await changeClient(processedRequestData.body) }
      } catch (error) {
        let e = error
        if(typeof error == 'object') {
          e = JSON.stringify(error)
        }
        return { success: false, data: `Erro ao confirmar alteração da rede do dispositivo: ${e}` }
      }
      break;

    default:
      return { success: false, data: `Ação inválida!` }
  }

  try {

    let databaseParameters = {
      action: databaseAction,
      collection: databaseCollection,
      query: databaseQuery,
      filter: databaseFilter
    }

    return {
      success: true,
      data: await context.functions.execute(`databaseControl`, databaseParameters)
    }

  } catch (error) {
    return { success: false, data: error }
  }
};


/**
 * 
 * @param {*} requestData 
 * @returns 
 */
async function getRadioNumber(requestData) {
  var deviceType = requestData.deviceName.substring(4, 9)
  var ret = {}
  var client

  ret.type = deviceType

  /**
   * Retrieving Device information
   */
  let databaseParameters = {
    action: `findOne`,
    collection: `radios`,
    query: { address64Bit: requestData.mac }
  }

  let device = await context.functions.execute(`databaseControl`, databaseParameters)

  /**
   * Retrieving Client information
   */
  databaseParameters = {
    action: `findOne`,
    collection: `clients`,
    query: { _id: requestData.clientId }
  }

  client = await context.functions.execute(`databaseControl`, databaseParameters)

  if (client == undefined) {
    throw `Não foi possível encontrar o cliente informado`
  }

  /**
   * Proccessing information
   * We need to check if there is any device of this type on this client network and return next number
   */
  if (await isEmpty(device)) {               //In this case, device network was never changed
    ret.rewrite = false
    ret.overwrite = false
    
    let definitiveNumber
    if(client.deviceSummary == undefined)  {
      definitiveNumber = 1
    } else {
      let lastDeviceNumber = client.deviceSummary[`${deviceType}`]
      if(lastDeviceNumber != null && lastDeviceNumber != undefined && lastDeviceNumber != ``) {
        definitiveNumber = lastDeviceNumber + 1
      } else {
        definitiveNumber = 1;
      }
    }
    
    ret.name = `${client.initials}_${deviceType}${String(definitiveNumber).padStart(4, '0')}`
  } else {                                                                            //In this case, device already exists
    let definitiveNumber
    ret.rewrite = true
    ret.overwrite = (device.deviceTypeInitials != deviceType);
    if(ret.overwrite) {
      if(client.summary != undefined && client.summary != null && client.summary != ``) {
        let lastDeviceNumber = client.summary[`${deviceType}`];
        if(lastDeviceNumber != null && lastDeviceNumber != undefined && lastDeviceNumber != ``) {
          definitiveNumber = lastDeviceNumber + 1;
        } else {
          definitiveNumber = 1;
        }
      } else {
        definitiveNumber = 1;
      }
      ret.name = `${client.initials}_${deviceType}${String(definitiveNumber).padStart(4, '0')}`;
    } else {
      ret.name = `${device.name}`;
    }
  }
  return ret;
}

/**
 * updates database with information about changes on a device network
 * 
 * @param {*} requestData 
 * {
 *  mac: <address64Bit>
 *  clientId: <ooid>
 *  deviceName: <String>
 * }
 */
async function changeClient(requestData) {
  var device;
  var client;


  /**
   * Campos obrigatórios:
   * - mac
   * - name
   * - firmwareVersion
   * - hardwareVersion
   * 
   */

  //Atualizar Rádio
  /**
   * Retrieving Device information
   */
  let databaseParameters = {
    action: `findOne`,
    collection: `radios`,
    query: { address64Bit: requestData.mac }
  };

  try {
    device = await context.functions.execute(`databaseControl`, databaseParameters);
  } catch (error) {
    return { success: false, data: error };
  }
  
  /**
   * Retrieving Client information
   */
  databaseParameters = {
    action: `findOne`,
    collection: `clients`,
    query: { _id: requestData.clientId }
  };

  try {
    client = await context.functions.execute(`databaseControl`, databaseParameters);
  } catch (error) {
    return { success: false, data: error };
  }
  
  var deviceType = await getDeviceTypeByName(requestData.name);
  let profileId = requestData.firmwareVersion.substring(0, 2);
  let manufacturerId = requestData.firmwareVersion.substring(3, 6);

  var deviceToInsert;
  var deviceNumber;
  try {
    
    deviceNumber = +requestData.name.substring(9,13);
    deviceToInsert = {
      'name': `${requestData.name}`,
      'number': deviceNumber,
      'firmwareVersion': `${requestData.firmwareVersion}`,
      'hardwareVersion': `${requestData.hardwareVersion}`,
      'profileId': `${profileId}`,
      'manufacturerId': `${manufacturerId}`,
      'group': `${(requestData.name).substring(4, 9)}`,                         // I'm using the same as the device Initials
      'deviceTypeId': `${deviceType.id}`,
      'deviceTypeInitials': `${deviceType.initials}`,
      'deviceTypeName': `${deviceType.name}`,
      'deviceTypeDescription': `${deviceType.description}`,
      'deviceClass': `${deviceType.class}`,
      'productCode': `${deviceType.productCode}`,
      'clientOID': `${client._id}`,
      'clientName': `${client.name}`,
      'clientInitials': `${client.initials}`,
      'clientChannel': client.channel,
      'clientType': {
        'type': client.clientType.type,
        'name': `${client.clientType.name}`
      },
      'recordingDate': new Date()
    };
  } catch (e) {
    throw `Houve um problema com os dados do dispositivo a ser atualizado! ${e}`;
  }

  /**
   * UPSERT DEVICE
   */
  try {
    let filter = {address64Bit:requestData.mac};
    await context.services.get("mongodb-atlas").db("configRadio").collection(`radios`).updateOne(
      filter,
      {"$set": deviceToInsert},
      {"upsert": true}
    );
  } catch (error) {
    throw `Ocorreu um erro ao atualizar o número do dispositivo! ${error}`;
  }
  
  /**
   * UPDATE CLIENT
   */
  try {
    let filter = { _id: new BSON.ObjectId(`${client._id}`)};
    
    let clientToInsert = {};
    if(clientToInsert.deviceSummary != undefined && client.deviceSummary != null && client.deviceSummary != ``) {
      clientToInsert.deviceSummary[`${deviceType.initials}`] = deviceNumber;
    } else {
      clientToInsert.deviceSummary = {};
      clientToInsert.deviceSummary[`${deviceType.initials}`] = deviceNumber;
    }

    await context.services.get("mongodb-atlas").db("configRadio").collection(`clients`).updateOne(
      filter,
      {"$set": clientToInsert}
    );
  } catch (error) {
    throw `Ocorreu um erro ao atualizar o número do dispositivo! ${error}`;
}
  return `A rede do dispositivo foi alterada com sucesso!`;
}

/**
 * 
 * @returns 
 */
async function getDeviceTypeByName(name) {
  return { id: 1, initials: `LRDFT`, name: `Long Range Smoke Detector`, description: `Equipment used to detect smoke`, 'class': 1, productCode: 153524354};
}

/**
 * 
 * @param {*} valueToBeChecked 
 * @returns 
 */
function isEmpty(valueToBeChecked) {
  return (valueToBeChecked == null || valueToBeChecked == `` || valueToBeChecked == undefined || isNaN(valueToBeChecked));
}