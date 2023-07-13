/* eslint-disable no-undef */
// eslint-disable-next-line n/no-exports-assign
exports = async function (payload) {
  /**
    * Processa a requisição: Decodifica os dados e depois tranforma em formato JSON
    */
  try {
    processedRequestData = await context.functions.execute('proccessRequest', payload)
  } catch (error) {
    return { success: false, data: error }
  }

  /**
   * Valida os dados de acordo com a ação requisitada
   */
  try {
    await context.functions.execute('companiesValidation', processedRequestData)
  } catch (error) {
    return { success: false, data: error }
  }

  switch (action) {
    case 'create':
      databaseAction = 'insertOne'
      break

    case 'findOne':
      databaseAction = 'findOne'
      break

    case 'findAll':
      operationName = 'findMany'
      operationParameters = {}
      break

    case 'findMany':
      operationName = 'findMany'
      if (payload.body == null) {
        throw new Error('É necessário fornecer informações válidas para pesquisar no Banco de Dados!')
      }

      try {
        operationParameters = JSON.parse(payload.body.text())
      } catch (e) {
        throw new Error('É necessário fornecer informações válidas (array) para pesquisar no Banco de Dados!')
      }
      break

    case 'updateOne':
      operationName = 'databaseUpdateOne'
      break

    case 'excludeOne':
      operationName = 'databaseExcludeOne'
      break

    case 'deleteOne':
      operationName = 'databaseDeleteOne'
      break

    case 'insertMany':

      if (payload.body == null) {
        throw new Error('É necessário fornecer informações válidas para inserir no Banco de Dados!')
      }

      try {
        operationParameters = JSON.parse(payload.body.text())
      } catch (e) {
        throw new Error('É necessário fornecer informações válidas para inserir no Banco de Dados!')
      }
      operationName = 'radiosInsertMany'
      break

    default:
      return { success: false, data: 'Ação inválida!' }
  }

  try {
    const databaseParameters = {
      action: databaseAction,
      collection: databaseCollection,
      query: databaseQuery,
      filter: databaseFilter
    }

    return {
      success: true,
      data: await context.functions.execute('databaseControl', databaseParameters)
    }
  } catch (error) {
    return { success: false, data: error }
  }
}
