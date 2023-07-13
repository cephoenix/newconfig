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
  }
}
