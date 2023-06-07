exports = async function (payload) {

  var action
  var operationName
  var operationResponse
  var operationParameters = {}

  try {
    action = payload.query.action
  } catch (error) {
    throw {
      success: false,
      data: `Nenhuma ação informada! Erro: ${error}`
    }
  }

  try {
    await context.functions.execute(`clientsValidation`, payload)
  } catch (error) {
    throw {
      success: false,
      data: error
    }
  }

  try {
    operationParameters.query = payload.body.text()
  } catch (error) {
    throw {
      success: false,
      data: `Erro ao efetuar operação: ${error}`
    }
  }

  switch (action) {
    case 'create':
      operationName = 'dataBaseInsertOne'
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
      throw {
        success: false,
        data: `Ação inválida!`
      }
  }

  try {
    operationParameters.collection = `clients`
    operationResponse = await context.functions.execute(operationName, operationParameters)
    return {
      success: true,
      data: operationResponse
    }
  } catch (error) {
    throw {
      success: false,
      data: `Ocorreu um erro! ${error}`
    }
  }
};