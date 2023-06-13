exports = async function (payload) {

  var action
  const databaseCollection = `users`
  var databaseAction
  var databaseQuery
  var requestData
  
  try {
    requestData = await context.functions.execute(`proccessRequest`, payload)
  } catch (error) {
    return { success: false, data: error}
  }

  try {
    await context.functions.execute(`usersValidation`, requestData)
  } catch (error) {
    return { success: false, data: error}
  }

  action = requestData.urlParameters.action
  databaseQuery = requestData.body

  switch (action) {
    case 'create':
      databaseAction = `insertOne`

      try {
        databaseQuery.password = await context.functions.execute("decryptText", databaseQuery.password);
      } catch (e) {
        return { success: false, data: `Erro ao decriptografar a senha fornecida: ${e}`}
      }
  
      try {
        databaseQuery.password = await context.functions.execute("encryptPassword", databaseQuery.password);
      } catch (e) {
        return { success: false, data: `Erro ao encriptar a senha a ser gravada no Banco de Dados: ${e}`}
      }

      databaseQuery.blocked = true                                                                           // All users are blocked by default. Someone with the right permission level need to activate them

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