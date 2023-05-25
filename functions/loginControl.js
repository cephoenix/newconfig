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

  if(payload.body == undefined) {
    resp.success = false
    resp.data = "Favor informar dados válidos (body)!"
    return resp
  }
  try {
    JSON.parse(payload.body)
  } catch (e) {
    resp.success = false
    resp.data = {payload: payload, body: payload.body, msg: "Favor informar dados válidos (body)!", e: e, data: payload.body.data}
    return resp
  }

  switch (action) {
    case 'doLogin':
      operationName = 'loginDoLogin'
      if (payload.body === null) {
        throw "É necessário fornecer informações válidas para autenticação!"
      }
      operationParameters = payload.body.text()
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