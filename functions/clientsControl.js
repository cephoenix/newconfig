exports = async function (payload) {

  var action
  const databaseCollection = `clients`
  var databaseAction
  var databaseQuery
  var requestData

  try {
    requestData = await context.functions.execute(`proccessRequest`, payload)
  } catch (error) {
    return { success: false, data: error}
  }

  try {
    await context.functions.execute(`clientsValidation`, payload)
  } catch (error) {
    return { success: false, data: error}
  }

  action = requestData.urlParameters.action
  databaseQuery = requestData.body

  switch (action) {
    case 'create':
      databaseAction = `insertOne`
      break;

      case 'findOne':
        databaseAction = `findOne`
        break;

      case 'findAll':
        databaseAction = `findAll`
        databaseQuery = {}
        break;
  
      case 'findMany':
        databaseAction = `findMany`
        break;
  
      case 'updateOne':
        databaseAction = `updateOne`
        break;
  
      case 'excludeOne':
        databaseAction = `excludeOne`
        break;
  
      case 'deleteOne':
        databaseAction = `deleteOne`
        break;
  
      default:
        return { success: false, data: `Ação inválida!`}
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
    return { success: false, data: `Erro ao executar operação ${action} em Usuário! ${error}` }
  }
};