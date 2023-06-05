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
    throw "Invalid action! Please fill in a propper action."
  }

  if(payload.body == undefined || payload.body == "" || payload.body == null) {
    operationParameters.query = {}
  } else {
    operationParameters.query = payload.body.text()
  }
  operationParameters.collection = `clients`

  switch (action) {
    case 'create':
      validateCreate(operationResponse)
      let query = {
        $or: [
          { "initials": parameters.initials },
          { "cpfCnpj": parameters.cpfCnpj },
          { "networkKey": parameters.networkKey },
          { "panId": parameters.panId }
        ]
      }
    
      try {
        dbResponse = await context.functions.execute('databaseFindOne', { query: EJSON.stringify(parameters), collection: COLLECTION });
      } catch (e) {
        throw (e)
      }

      operationName = 'dataBaseInsertMany';
      var params = payload.body.text()
      
      break;

    case 'findOne':
      operationName = 'databaseFindOne';
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
  throw "Rá! Debugando!"
}