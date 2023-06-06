exports = async function (payload, response) {

  let action
  let resp = {}
  let operationName
  let operationResponse
  let operationParameters
  var success = true
  
  /**
   * Ao atualizar um rádio a resposta vai ser o cliente desse rádio com o resumo de dispositivos atualizado
   */

  try {
    await context.functions.execute(`radiosValidation`, payload)
  } catch (error) {
    return {
      success: false,
      data: `Erro ao validar operação com Radio: ${error}`
    }
  }

  /**
   * Se tiver alguma verificação geral, que deve ser feita para todas as ações, ela deve ser feita aqui
   * Verificações específicas são feitas dentro de cada uma das operações
   */

  switch (action) {
    case 'create':
      operationName = 'databaseInsertOne';
      operationParameters = payload.body;
      break;

    case 'findOne':
      operationName = 'radiosFindOne';
      operationParameters = payload.body;
      break;

    case 'findAll':
      operationName = 'radiosFindMany';
      operationParameters = null;
      break;

    case 'findMany':
      if(payload.body == undefined || payload.body == null) {
        throw "É necessário fornecer informações válidas para pesquisar no Banco de Dados! (1)"
      }
      
      try {
        operationParameters = JSON.parse(payload.body.text())
      } catch (e) {
        throw "É necessário fornecer informações válidas (array) para pesquisar no Banco de Dados! (3)"
      }

      operationName = 'radiosFindMany';
      break;

    case 'updateOne':
      operationName = 'databaseUpdateOne';
      operationParameters = payload.body;
      break;

    case 'excludeOne':
      operationName = 'radiosExcludeOne';
      operationParameters = payload.body;
      break;

    case 'deleteOne':
      operationName = 'radiosDeleteOne';
      operationParameters = payload.body;
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
      if (action != null) {
        resp.data = "Ação inválida!"
      } else {
        resp.data = "Nenhuma ação informada!"
      }

      resp.success = false
      return resp
  }
  
  try {
    operationResponse = await context.functions.execute(operationName, operationParameters);
  } catch (e) {
    success = false
    operationResponse = `Erro ao executar operação com Rádio: ${e}`
  }

  resp.success = success;
  resp.data = operationResponse;
  return resp;
};