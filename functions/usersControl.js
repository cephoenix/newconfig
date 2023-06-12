exports = async function (payload) {

  var action
  var operationName
  var operationResponse
  var operationParameters = {}
  var password
  var parameters

  try {
    await context.functions.execute(`usersValidation`, payload)
  } catch (error) {
    return {
      success: false,
      data: `${JSON.stringify(error)}`
    }
  }
  
  action = payload.query.action
  operationParameters.collection = `users`
  operationParameters.query = payload.body.text()

  switch (action) {
    case 'create':
      operationName = 'databaseInsertOne'
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
        operationParameters.query = JSON.stringify(parameters)
      } catch (error) {
        throw `Forneça informações válidas para criar usuário! ${error}`
      }

      break;

    case 'findOne':
      operationName = 'databaseFindOne'
      break;

    case 'findAll':
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
    operationResponse = await context.functions.execute(operationName, operationParameters)
    return {
      success: true,
      data: operationResponse
    }
  } catch (error) {
    throw {
      success: false,
      data: `Erro ao executar operação ${operationName} em Usuário! ${error}`
    }
  }
};