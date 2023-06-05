exports = async function (payload) {

  const dbquery = context.services.get(`mongodb-atlas`).db(`configRadio`).collection(`clients`);
  let action;
  var success = true;
  let operationName;
  var operationResponse
  var resp = {}
  var operationParameters = {};

  try {
    await context.functions.execute(`clientsValidation`, payload);
  } catch (error) {
    return {
      success: false,
      data: error
    }
  }
  
  // maybe create a processing here 

  switch (action) {
    case 'create':
      operationName = 'dataBaseInsertMany';
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
  }

  try {
    operationResponse = await context.functions.execute(operationName, operationParameters);
  } catch (e) {
      success = false
      operationResponse = e.message
  }

  resp.success = true
  resp.data = operationResponse
  return resp
};