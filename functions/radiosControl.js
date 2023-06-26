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
    case 'changeClient':
      try {
        return { success: true, data: await changeClient(processedRequestData.body) }
      } catch (error) {
        return { success: false, data: `Erro ao confirmar alteração da rede do dispositivo: ${error}` }
      }

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
  databaseParameters = {
    action: `findOne`,
    collection: `radios`,
    query: { address64Bit: requestData.mac }
  }

  let device = await context.functions.execute(`databaseControl`, databaseParameters)

  /**
   * Retrieving Client information
   */
  let databaseParameters = {
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
    ret.name = `${client.initials}_${deviceType}0001`

    // /**
    //  * Creating/Updating device summary
    //  */
    // if(await isEmpty(client.deviceSummary)) {
    //   client.deviceSummary = {}
    //   client.deviceSummary[deviceType] = 1
    // } else {
    //   if(await isEmpty(client.deviceSummary[deviceType])) {
    //     client.deviceSummary[deviceType] = 1
    //   } else {
    //     client.deviceSummary[deviceType] = client.deviceSummary[deviceType] + 1
    //   }
    // }
  } else {                                                                            //In this case, device already exists
    ret.rewrite = true
    ret.overwrite = (device.deviceTypeInitials != deviceType)
    if (await isEmpty(device.number)) {                                                 //If device already exists, but has no number we return number 1. This case probably will never happen (it shouldn't)
      ret.name = `${client.initials}_${deviceType}0001`
      // client.deviceSummary[deviceType] = 1
    } else {
      ret.name = `${client.initials}_${deviceType}${device.number + 1}`
    }
  }
  return ret
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
  var device
  var client

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
  databaseParameters = {
    action: `findOne`,
    collection: `radios`,
    query: { address64Bit: requestData.mac }
  }

  try {
    device = await context.functions.execute(`databaseControl`, databaseParameters)
  } catch (error) {
    return { success: false, data: error }
  }

  /**
   * Retrieving Client information
   */
  let databaseParameters = {
    action: `findOne`,
    collection: `clients`,
    query: { _id: requestData.clientId }
  }

  try {
    client = await context.functions.execute(`databaseControl`, databaseParameters)
  } catch (error) {
    return { success: false, data: error }
  }

  let deviceType = await getDeviceTypeByName(requestData.name)
  let profileId = requestData.firmwareVersion.substring(0, 2)
  let manufacturerId = requestData.firmwareVersion.substring(3, 6)

  var deviceToInsert = {
    'address64Bit': `${requestData.mac}`,
    'address16Bits': 'FFFE',
    'oldDatabaseId': ``,
    'name': `${requestData.name}`,
    'number': `${(requestData.name).substring(0, -4)}`,
    'firmwareVersion': `${requestData.firmwareVersion}`,
    'hardwareVersion': `${requestData.hardwareVersion}`,
    'profileId': `${profileId}`,
    'manufacturerId': `${manufacturerId}`,
    'group': `${(requestData.name).substring(4, 8)}`,                         // I'm using the same as the device Initials
    'connectionRouterAddress': `NOT USED`,                                    //${requestData.connectionRouterAddress}`
    'deviceTypeId': `${deviceType.deviceTypeId}`,
    'deviceTypeInitials': `${deviceType.deviceTypeInitials}`,
    'deviceTypeName': `${deviceType.deviceTypeName}`,
    'deviceTypeDescription': `${deviceType.deviceTypeDescription}`,
    'deviceClass': `${deviceType.deviceClass}`,
    'productCode': `${deviceType.productCode}`,
    'status': "unused",
    'clientOID': `${client._id}`,
    'clientName': `${client.name}`,
    'clientInitials': `${client.initials}`,
    'clientChannel': `${client.channel}`,
    'clientType': {
      'type': `${client.clientType.type}`,
      'name': `${client.clientType.name}`
    },
    'recordingDate': new Date()
  }


  /**
   * UPDATE DEVICE SECTION
   */
  if (await isEmpty(device)) {               //In this case, device network was never changed
    //Atualiza as informações do Cliente primeiro
    if (await isEmpty(client.deviceSummary)) {
      client.deviceSummary = {}
      client.deviceSummary[deviceType] = 1
    } else {
      if (await isEmpty(client.deviceSummary[deviceType])) {
        client.deviceSummary[deviceType] = 1
      } else {
        client.deviceSummary[deviceType] = client.deviceSummary[deviceType] + 1
        /**
         * Atenção! Talvez seja necessário fazer uma validação entre o nome do dispositivo e esse número aqui
         * 
         */
      }
    }

    let filter
    try {
      filter = { _id: new BSON.ObjectId(`${client._id}`) }  
    } catch (error) {
      throw `Erro de conversão no ID do cliente. Id: ${client._id}. ${error}`
    }
    
    let options = { upsert: true}

    try {
      const dbquery = context.services.get("mongodb-atlas").db("configRadio").collection(`clients`).updateOne(filter, client, options)
    } catch (error) {
      throw `Erro ao mudar dispositivo de rede`
    }
    

    let databaseParameters = {
      action: `updateOne`,
      collection: `clients`,
      filter: { id: requestData.clientId },
      query: client
    }

    try {
      client = await context.functions.execute(`databaseControl`, databaseParameters)
    } catch (error) {
      throw `Falha ao atualizar cliente do Rádio! ${JSON.stringify(error)} DBParams: ${JSON.stringify(databaseParameters)} `
    }

    //Depois cria o Dispositivo
    databaseParameters = {
      action: `insertOne`,
      collection: `radios`,
      query: deviceToInsert
    }

    try {
      client = await context.functions.execute(`databaseControl`, databaseParameters)
    } catch (error) {
      throw `Falha ao atualizar Rádio: ${error}`
    }

  } else {                                                                            //In this case, device already exists
    if (await isEmpty(device.number)) {                                                 //If device already exists, but has no number we should verify if device name is correct. Its number should be 0001
      client.deviceSummary[deviceType] = 1
    } else {
      // ret.name = device.name
    }

    //Depois atualiza o Dispositivo
    databaseParameters = {
      action: `updateOne`,
      collection: `radios`,
      filter: { mac: deviceToInsert.mac },
      query: deviceToInsert,
      options: { upsert: true }
    }

    try {
      client = await context.functions.execute(`databaseControl`, databaseParameters)
    } catch (error) {
      throw `Falha ao atualizar Rádio: ${error}`
    }
  }

  /**
   * UPDATE CLIENT SECTION
   */

  //Atualizar Cliente

  return `A rede do dispositivo foi alterada com sucesso!`
}



/**
 * 
 * @returns 
 */
async function getDeviceTypeByName(name) {
  return { id: 1, initials: `LRDFT`, name: `Long Range Smoke Detector`, description: `Equipment used to detect smoke` };
}

/**
 * 
 * @param {*} valueToBeChecked 
 * @returns 
 */
async function isEmpty(valueToBeChecked) {
  return (valueToBeChecked == null || valueToBeChecked == `` || valueToBeChecked == undefined)
}