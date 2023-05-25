exports = async function (payload) {
  let action
  let resp = {}
  let operationName
  let operationResponse
  let operationParameters
  let success = true

  try {
    //id, action, page etc should be on url parameters. These parameters are contained inside payload.query
    action = payload.query.action
  } catch (err) {
    action = payload.action
  }

  switch (action) {
    case 'doLogin':
      operationName = 'loginDoLogin'

      if(payload.body == undefined) {
        resp.success = false
        resp.data = "Favor informar dados válidos!"
        return resp
      }

      if (payload.body === null) {
        throw "É necessário fornecer informações válidas para autenticação!"
      }
    
      try {
        operationParameters = JSON.parse(payload.body.text())
      } catch (e) {
        resp.success = false
        resp.data = "Favor informar dados válidos (2)!"
        return resp
      }

      break;

    default:
      if (action != null) {
        resp.data = "Ação inválida!"
      } else {
        resp.data = "Nenhuma ação informada!"
      }

      resp.success = false
      resp.data = operationResponse
      return resp
  }

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