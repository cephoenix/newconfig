exports = async function (payload, response) {

  const dbquery = context.services.get("mongodb-atlas").db("configRadio").collection("radios");
  let action;
  let resp = {};
  let operationName;
  let operationResponse;
  let operationParameters;
  

  try {
    //id, action, page etc should be on url parameters. These parameters are contained inside payload.query
    action = payload.query.action;
  } catch (err) {
    action = payload.action;
  }

  /**
   * Se tiver alguma verificação geral, que deve ser feita para todas as ações, ela deve ser feita aqui
   * Verificações específicas são feitas dentro de cada uma das operações
   */

  switch (action) {

    case 'create':
      operationName = 'radiosCreate';
      operationParameters = payload.body;
      break;

    case 'findOne':
      operationName = 'radiosFindOne';
      operationParameters = payload.body;
      break;

    case 'findAll':
      operationName = 'radiosFindMany';
      operationParameters = null;
      break;

    case 'findMany':
      operationName = 'radiosFindMany';
      operationParameters = payload.body;
      break;

    case 'updateOne':
      operationName = 'radiosUpdateOne';
      operationParameters = payload.body;
      break;

    case 'excludeOne':
      operationName = 'radiosExcludeOne';
      operationParameters = payload.body;
      break;

    case 'deleteOne':
      operationName = 'radiosDeleteOne';
      operationParameters = payload.body;
      break;

    case 'insertMany':
      operationName = 'radiosInsertMany ';
      operationParameters = payload.body;
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
    throw (e)
  }

  resp.success = 'true';
  resp.data = operationResponse;
  return resp;
};