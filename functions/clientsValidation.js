exports = async function (payload) {

  const dbquery = context.services.get("mongodb-atlas").db("configRadio").collection("clients");
  let action;
  var success = true;
  let operationName;
  var operationResponse
  var resp = {}
  var operationParameters = {};

  try {
    //id, action, page etc should be on url parameters. These parameters are contained inside payload.query
    action = payload.query.action;
  } catch (err) {
    throw "Ação inválida! Por favor forneça uma ação válida."
  }

  switch (action) {
    case 'create':
      validateCreate(operationResponse)
      break;

    case 'findOne':
      break;

    case 'findAll':
      break;

    case 'findMany':
      break;

    case 'updateOne':
      break;

    case 'excludeOne':
      break;

    case 'deleteOne':
      break;

    default:
      success = false
      if (action == null || action == undefined || action == ``) {
        response = "Ação inválida!";
      } else {
        response = "Nenhuma ação informada!";
        throw {debug: (action != null)}
      }
  }

  try {
    operationResponse = await context.functions.execute(operationName, operationParameters);
  } catch (e) {
      throw `Não é possível validar cliente. Erro: ${e}`
  }

  resp.success = success
  resp.data = operationResponse
  return resp
};

function validateCreate (params) {

}