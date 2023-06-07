exports = async function (payload) {

  const dbquery = context.services.get("mongodb-atlas").db("configRadio").collection("clients");
  let action;
  var success = true;
  let operationName;
  var operationResponse
  var resp = {}
  var operationParameters = {};
throw {debug: payload}
  try {
    //id, action, page etc should be on url parameters. These parameters are contained inside payload.query
    action = payload.query.action;
  } catch (err) {
    throw "Ação inválida! Por favor forneça uma ação válida."
  }

  operationParameters.collection = `clients`

  switch (action) {
    case 'create':
      validateCreate(operationResponse)
      break;

    case 'findOne':
      
      break;

    case 'findAll':
      operationName = 'databaseFindMany';
      operationParameters.query = '{}'
      break;

    case 'findMany':
      operationName = 'databaseFindMany';
      break;

    case 'updateOne':
      operationName = 'clientsUpdateOne';
      break;

    case 'excludeOne':
      operationName = 'clientsExcludeOne';
      break;

    case 'deleteOne':
      operationName = 'clientsDeleteOne';
      break;

    // case 'updateMany':
    //   // resultado = await dbquery.updateOne(
    //   //   args.filter, 
    //   //   [
    //   //     {$set: args.values}
    //   //   ]
    //   // );
    //   break;

    // case 'excludeMany':
    //   // resultado = await dbquery.updateOne(
    //   //   args.filter, 
    //   //   [
    //   //     {$set: {status : "removed", DataExclusao : "passa data" , deletedAt: new Date()}}
    //   //   ]
    //   // );
    //   break;

    default:
      success = false
      if (action != null) {
        response = "Ação inválida!";
      } else {
        response = "Nenhuma ação informada!";
      }
  }

  try {
    operationResponse = await context.functions.execute(operationName, operationParameters);
  } catch (e) {
      success = false
      operationResponse = e.message
  }

  resp.success = success
  resp.data = operationResponse
  return resp
};

function validateCreate (params) {
  
}