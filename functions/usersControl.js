exports = async function (payload) {

  var action
  var operationName
  var operationResponse
  var operationParameters = {}
  var password
  var parameters
  var databaseCollection = `users`
  var databaseAction
  var databaseQuery

  try {
    await context.functions.execute(`usersValidation`, payload)
  } catch (error) {
    throw error
  }
  
  action = payload.query.action
  
  operationParameters.collection = `users`
  operationParameters.query = payload.body.text()

  databaseQuery = JSON.parse(payload.body.text())

  switch (action) {
    case 'create':
      databaseAction = `insertOne`
      operationParameters.action = `insertOne`
      // operationName = 'databaseInsertOne'
      parameters = JSON.parse(operationParameters.query)
      try {
        password = await context.functions.execute("decryptText", parameters.password);
      } catch (e) {
        throw `Erro ao decriptografar a senha fornecida: ${e}`
      }
  
      try {
        password = await context.functions.execute("encryptPassword", password);
      } catch (e) {
        throw `Erro ao encriptar a senha a ser gravada no Banco de Dados: ${e}`
      }

      try {
        parameters.password = password
        parameters.blocked = true
        operationParameters.query = JSON.stringify(parameters)
      } catch (error) {
        throw `Forneça informações válidas para criar usuário! ${error}`
      }

      break;

    case 'findOne':
      databaseAction = `findOne`
      operationParameters.action = `findOne`
      // operationName = 'databaseFindOne'
      break;

    case 'findAll':
      operationParameters.action = `findAll`
      operationName = 'databaseFindMany'
      operationParameters.query = {}
      break;

    case 'findMany':
      operationName = 'databaseFindMany'
      break;

    case 'updateOne':
      operationName = 'databaseUpdateOne'
      break;

    case 'excludeOne':
      operationName = 'databaseExcludeOne'
      break;

    case 'deleteOne':
      operationName = 'databaseDeleteOne'
      break;

    default:
      return {
        success: false,
        data: `Ação inválida!`
      }
  }

  try {
    
    let databaseParameters = {
      action: databaseAction,
      collection: databaseCollection,
      query: databaseQuery
    }

    return {
      success: true,
      data: await context.functions.execute(`databaseControl`, databaseParameters)
    }

  } catch (error) {
    throw {
      success: false,
      data: `Erro ao executar operação ${action} em Usuário! ${error}`
    }
  }
};