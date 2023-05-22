exports = async function(payload, response){

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

    case 'create':
      operationName = 'clientsCreate';
      operationParameters = payload.body;
      break;

    case 'findOne':
      operationName = 'clientsFindOne';
      operationParameters = payload.body;
      break;
  
    case 'findAll':
      operationName = 'clientsFindMany';
      operationParameters = null;
      break;
      
    case 'findMany':
      operationName = 'clientsFindMany';
      operationParameters = payload.body;
      break;
  
    case 'updateOne':
      operationName = 'clientsUpdateOne';
      operationParameters = payload.body;
      break;

    case 'excludeOne':
      operationName = 'clientsExcludeOne';
      operationParameters = payload.body;
      break;
      
    case 'deleteOne':
      operationName = 'clientsDeleteOne';
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
      if(action!=null) {
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
  } catch (e){
      throw(e)
  }

  resp.status = 'success';
  resp.data = operationResponse;
  return resp;
};