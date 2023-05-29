exports = async function (payload, response) {

  let action
  let resp = {}
  let operationName
  let operationResponse
  let operationParameters
  var success = true
  
  try {
    //id, action, page etc should be on url parameters. These parameters are contained inside payload.query
    action = payload.query.action;
  } catch (err) {
    action = payload.action;
  }

  /**
   * Se tiver alguma verificação geral, que deve ser feita para todas as ações, ela deve ser feita aqui
   * Verificações específicas são feitas dentro de cada uma das operações
   */

  switch (action) {
    case 'create':
      operationName = 'radiosCreate';
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
      operationName = 'radiosFindMany';
      operationParameters = payload.body;
      break;

    case 'updateOne':
      operationName = 'radiosUpdateOne';
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
    operationResponse = e
  }

  resp.success = success;
  resp.data = operationResponse;
  return resp;
};