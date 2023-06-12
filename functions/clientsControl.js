exports = async function (payload) {

  var action
  var operationName
  var operationResponse
  var operationParameters = {}

  try {
    await context.functions.execute(`clientsValidation`, payload)
  } catch (error) {
    return {
      success: false,
      data: `Erro ao validar operação com Cliente: ${error}`
    }
  }

  action = payload.query.action
  operationParameters.collection = `clients`
  operationParameters.query = payload.body.text()

  switch (action) {
    case 'create':
      operationName = 'databaseInsertOne'
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
      data: `Erro ao executar operação ${operationName} em Cliente! ${error}`
    }
  }
};