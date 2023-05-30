exports = async function (payload) {
  
  let action
  var resp = {}
  let operationName
  let operationResponse
  let operationParameters
  let success = true
return payload
  try {
    //id, action, page etc should be on url parameters. These parameters are contained inside payload.query
    action = payload.query.action
  } catch (err) {
    action = payload.action
  }

  /**
   * Se tiver alguma verificação geral, que deve ser feita para todas as ações, ela deve ser feita aqui
   * Verificações específicas são feitas dentro de cada uma das operações
   */

  switch (action) {
    case 'populateRadiosCollection':
      operationName = 'testsPopulateRadiosCollection'
      operationParameters = null
      break;

      case 'rebuildDatabase':
        operationName = 'testsRebuildDatabase'
        operationParameters = null
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
return {operationName: operationName, operationParameters: operationParameters}
  try {
    operationResponse = await context.functions.execute(operationName, operationParameters);
  } catch (e) {
    success = false
    operationResponse = e
  }

  resp.success = success
  resp.data = operationResponse
  return resp
};