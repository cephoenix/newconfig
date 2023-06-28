/* eslint-disable no-undef */
// eslint-disable-next-line n/no-exports-assign
exports = async function (payload) {
  const databaseCollection = 'clients'
  let databaseAction
  let databaseQuery
  let requestData

  try {
    requestData = await context.functions.execute('proccessRequest', payload)
  } catch (error) {
    return { success: false, data: error }
  }

  try {
    await context.functions.execute('clientsValidation', requestData)
  } catch (error) {
    return { success: false, data: error }
  }

  databaseQuery = requestData.body

  switch (requestData.urlParameters.action) {
    case 'create':
      databaseAction = 'insertOne'
      break

    case 'findOne':
      databaseAction = 'findOne'
      break

    case 'findAll':
      databaseAction = 'findMany'
      databaseQuery = {}
      break

    case 'findMany':
      databaseAction = 'findMany'
      break

    case 'updateOne':
      databaseAction = 'updateOne'
      break

    case 'excludeOne':
      databaseAction = 'excludeOne'
      break

    case 'deleteOne':
      databaseAction = 'deleteOne'
      break

    default:
      return { success: false, data: 'Ação inválida!' }
  }

  try {
    const databaseParameters = {
      action: databaseAction,
      collection: databaseCollection,
      query: databaseQuery
    }

    return {
      success: true,
      data: await context.functions.execute('databaseControl', databaseParameters)
    }
  } catch (error) {
    // return { success: false, data: `Erro ao executar operação ${action} em Clientes! ${error}` }
    return { success: false, data: error }
  }
}
