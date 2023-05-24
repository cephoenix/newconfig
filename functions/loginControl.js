exports = async function (payload) {
  let action;
  let resp = {};
  let operationName;
  let operationResponse;
  let operationParameters;
  let success = true;


  try {
    //id, action, page etc should be on url parameters. These parameters are contained inside payload.query
    action = payload.query.action;
  } catch (err) {
    action = payload.action;
  }

  switch (action) {

    case 'doLogin':
      operationName = 'loginDoLogin';
      operationParameters = payload.body.text();
      break;

    default:
      if (action != null) {
        resp.data = "Ação inválida!";
      } else {
        resp.data = "Nenhuma ação informada!";
      }

      resp.success = false;
      resp.data = operationResponse;
      return resp;
  }

  try {
    operationResponse = await context.functions.execute(operationName, operationParameters);
  } catch (e) {
    success = false
    operationResponse = e.message
  }

  resp.success = success;
  resp.data = operationResponse;
  return resp;
};