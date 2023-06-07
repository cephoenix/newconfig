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
      data: error
    }
  }

  action = payload.query.action

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
    operationParameters.collection = `clients`
    return {debug2: EJSON.parse(payload.body.text())}
    operationParameters.query = payload.body.text()
    operationResponse = await context.functions.execute(operationName, operationParameters)
    return {
      success: true,
      data: operationResponse
    }
  } catch (error) {
    return {
      success: false,
      data: `Ocorreu um erro (1)! ${error}`
    }
  }
};