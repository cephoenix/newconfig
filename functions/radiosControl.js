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
    return {debug1: payload.action}
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
      operationName = 'radiosInsertMany ';
      operationParameters = payload.body;
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
    return {action: action, operationName: operationName, parameters: operationParameters}
    operationResponse = await context.functions.execute(operationName, operationParameters);
    
  } catch (e) {
    success = false
    operationResponse = e
    return {deubo: e, action: action, operationName: operationName, parameters: operationParameters, resp: operationResponse}
  }

  resp.success = success;
  resp.data = operationResponse;
  return resp;
};