exports = async function (payload, response) {

  const dbquery = context.services.get("mongodb-atlas").db("configRadio").collection("users");
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

    case 'create':
      operationName = 'usersCreate';
      operationParameters = payload.body.text();
      break;

    case 'findOne':
      operationName = 'usersFindOne';
      operationParameters = payload.body.text();
      break;

    case 'findAll':
      operationName = 'usersFindMany';
      operationParameters = null;
      break;

    case 'findMany':
      operationName = 'usersFindMany';
      operationParameters = payload.body.text();
      break;

    case 'updateOne':
      operationName = 'usersUpdateOne';
      operationParameters = payload.body.text();
      break;

    case 'excludeOne':
      operationName = 'usersExcludeOne';
      operationParameters = payload.body.text();
      break;

    case 'deleteOne':
      operationName = 'usersDeleteOne';
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
      let err = new Error();
      err.name = 'no_action_informed'
      err.message = "No action was informed";
      err.code = 1;
      err.TypeError = 1;
      throw err;
  }


  try {
    operationResponse = await context.functions.execute(operationName, operationParameters);
  } catch (e) {
    throw (e)
  }

  resp.success = 'true';
  resp.data = operationResponse;
  return resp;
};