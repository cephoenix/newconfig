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
    return { success: false, data: error}
  }

  /**
   * Ao atualizar um rádio a resposta vai ser o cliente desse rádio com o resumo de dispositivos atualizado
   */

  try {
    await context.functions.execute(`radiosValidation`, processedRequestData)
  } catch (error) {
    return { success: false, data: error}
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
      if(payload.body == undefined || payload.body == null) {
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

      if(payload.body == undefined) {
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
      return { success: true, data: await getRadioNumber(processedRequestData.body) }

    case 'changeClient':

      break;
    default:
      return { success: false, data: `Ação inválida!`}
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

async function getRadioNumber(requestData) {
  var deviceType = requestData.deviceName.substring(4,9)
  var ret = {}
  var client
  
  ret.type = deviceType

  databaseParameters = {
    action: `findOne`,
    collection: `radios`,
    query: { address64Bit: requestData.mac }
  }

  let device = await context.functions.execute(`databaseControl`, databaseParameters)

  //We need to check if there is any device of this type on this client network and return next number
  let databaseParameters = {
    action: `findOne`,
    collection: `clients`,
    query: { _id: requestData.clientId }
  }
  
  client = await context.functions.execute(`databaseControl`, databaseParameters)

  if(await isEmpty(device)) {               //In this case, device network was never changed
    ret.rewrite = false
    ret.overwrite = false
    ret.name = `${client.initials}_${deviceType}0001`

    //Inicializar o resumo do dispositivo aqui
    if(await isEmpty(client.deviceSummary)) {
      client.deviceSummary = {}
      client.deviceSummary[deviceType] = 1
    } else {
      if(await isEmpty(client.deviceSummary[deviceType])) {
        client.deviceSummary[deviceType] = 1
      } else {
        client.deviceSummary[deviceType] = client.deviceSummary[deviceType] + 1
      }
    }
  } else {                                                                            //In this case, device already exists
    ret.rewrite = true
    ret.overwrite = (device.deviceTypeInitials != deviceType)
    if(await isEmpty(device.number)) {                                                 //If device already exists, but has no number we return number 1. This case probably will never happen (it shouldn't)
      ret.name = `${client.initials}_${deviceType}0001`
      client.deviceSummary[deviceType] = 1
    } else {
      ret.name = device.name
    }
  }
  return ret
}

async function isEmpty(valueToBeChecked) {
  return (valueToBeChecked == null || valueToBeChecked == `` || valueToBeChecked == undefined)
}