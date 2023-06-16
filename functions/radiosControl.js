exports = async function (payload) {

  let action
  let operationName
  let operationResponse
  let operationParameters = {}
  var requestData
  var databaseAction
    
  return {debug: payload}
  /**
   * Processa a requisição: Decodifica os dados e depois tranforma em formato JSON
   */
  try {
    requestData = await context.functions.execute(`proccessRequest`, payload)
  } catch (error) {
    return { success: false, data: error}
  }

  /**
   * Ao atualizar um rádio a resposta vai ser o cliente desse rádio com o resumo de dispositivos atualizado
   */

  try {
    await context.functions.execute(`radiosValidation`, requestData)
  } catch (error) {
    return { success: false, data: error}
  }

  /**
   * Executa algum tratamento antes, se necessário, e depois faz a operação com o Banco de Dados
   */
  action = requestData.urlParameters.action
  databaseQuery = requestData.body

  switch (action) {
    case 'create':
      databaseAction = 'insertOne';
      break;

    case 'findOne':
      databaseAction = 'findOne';
      break;

    case 'findAll':
      operationName = 'findMany';
      operationParameters = {};
      break;

    case 'findMany':
      operationName = 'findMany';
      if(payload.body == undefined || payload.body == null) {
        throw "É necessário fornecer informações válidas para pesquisar no Banco de Dados! (1)"
      }
      
      try {
        operationParameters = JSON.parse(payload.body.text())
      } catch (e) {
        throw "É necessário fornecer informações válidas (array) para pesquisar no Banco de Dados! (3)"
      }
      break;

    case 'updateOne':
      operationName = 'databaseUpdateOne';
      break;

    case 'excludeOne':
      operationName = 'databaseExcludeOne';
      break;

    case 'deleteOne':
      operationName = 'databaseDeleteOne';
      break;

    case 'insertMany':

      if(payload.body == undefined) {
        throw "É necessário fornecer informações válidas para inserir no Banco de Dados! (1)"
      }
      
      if (payload.body == null) {
        throw "É necessário fornecer informações válidas para inserir no Banco de Dados! (2)"
      }

      try {
        operationParameters = JSON.parse(payload.body.text())
      } catch (e) {
        throw "É necessário fornecer informações válidas (array) para inserir no Banco de Dados! (3)"
      }
      operationName = 'radiosInsertMany';
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
      data: `Erro ao executar operação ${operationName} em Rádios! ${error}`
    }
  }
};