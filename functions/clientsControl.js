exports = async function (payload) {

  const dbquery = context.services.get("mongodb-atlas").db("configRadio").collection("clients");
  let action;
  var success = true;
  let operationName;
  var operationResponse
  var resp = {}
  let operationParameters;
  
  try {
    //id, action, page etc should be on url parameters. These parameters are contained inside payload.query
    action = payload.query.action;
  } catch (err) {
    action = payload.action;
  }

  // try {
  //   JSON.parse(payload.body.text())
  // } catch (e) {
  //   resp.success = false
  //   resp.data = "Favor informar dados válidos!"
  //   return resp
  // }

  switch (action) {

    case 'create':
      operationName = 'clientsCreate';
      operationParameters = payload.body.text();
      break;

    case 'findOne':
      operationName = 'databaseFindOne';
      operationParameters = { 
        collection: "clients",
        query: payload.body.text()
      };
      // operationParameters = payload.body.text();
      break;

    case 'findAll':
      operationName = 'databaseFindMany';
      operationParameters = {
        collection: 'clients',
        query: '{}'
      }
      break;

    // case 'getClients':
    //   operationName = 'clientsGetClients';
    //   operationParameters = payload.body.text();
    //   break;

    case 'findMany':
      operationName = 'databaseFindMany';
      operationParameters = {
        collection: 'clients',
        query: payload.body.text()
      }
      //payload.body.text();
      break;

    case 'updateOne':
      operationName = 'clientsUpdateOne';
      operationParameters = payload.body.text();
      break;

    case 'excludeOne':
      operationName = 'clientsExcludeOne';
      operationParameters = payload.body.text();
      break;

    case 'deleteOne':
      operationName = 'clientsDeleteOne';
      operationParameters = payload.body.text();
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