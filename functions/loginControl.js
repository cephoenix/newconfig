// exports = async function(payload){
//   let login;
//   let password;

//   let message = "MinhaSenha";

//   let encMessage = await context.functions.execute("encryptText", message);
//   parameters = EJSON.parse(payload.body.text())

//   login = parameters.login;
//   password = parameters.password;

//   return { login: login, password: await context.functions.execute("decryptText", password)};
// }



exports = async function (payload) {

  const dbquery = context.services.get("mongodb-atlas").db("configRadio").collection("clients");
  let action;
  let resp = {};
  let debug;
  let operationName;
  let operationResponse;
  let operationParameters;
  let body;

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
      let err = new Error();

      if (action != null) {
        err.name = 'invalid_action_informed'
        err.message = "Invalid action was informed";
      } else {
        err.name = 'no_action_informed'
        err.message = "No action was informed";
      }
      err.code = 1;
      err.TypeError = 1;
      throw err;
  }


  try {
    operationResponse = await context.functions.execute(operationName, operationParameters);
  } catch (e) {
    return { 
      success: false,
      data: e
    }
  }

  resp.success = true;
  resp.data = operationResponse;
  return resp;
};