exports = async function (payload) {

  const dbquery = context.services.get(`mongodb-atlas`).db(`configRadio`).collection(`clients`)
  let action
  var success = true
  let operationName
  var operationResponse
  var resp = {}
  var operationParameters = {}

  try {
    await context.functions.execute(`clientsValidation`, payload)
  } catch (error) {
    return {
      success: false,
      data: error
    }
  }

  // maybe create a general processing here 
  if(payload.body == undefined || payload.body == "" || payload.body == null) {
    operationParameters.query = {}
  } else {
    operationParameters.query = payload.body.text()
  }

  switch (action) {
    case 'create':

      // let query = {
      //   $or: [
      //     { "initials": operationParameters.query.initials },
      //     { "cpfCnpj": operationParameters.query.cpfCnpj },
      //     { "networkKey": operationParameters.query.networkKey },
      //     { "panId": operationParameters.query.panId }
      //   ]
      // }

      // try {
      //   dbResponse = await context.functions.execute('databaseFindOne', { query: query, collection: `clients` })
      // } catch (e) {
      //   throw (e)
      // }

      operationName = 'dataBaseInsertOne'
      break;

    case 'findOne':
      operationName = 'databaseFindOne'
      break;

    case 'findAll':
      operationName = 'databaseFindMany'
      operationParameters.query = '{}'
      break;

    case 'findMany':
      operationName = 'databaseFindMany'
      break;

    case 'updateOne':
      operationName = 'databaseUpdateOne'
      break;

    case 'excludeOne':
      operationName = 'databaseExcludeOne'
      break;

    case 'deleteOne':
      operationName = 'databaseDeleteOne'
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
      if (action != null) {
        resp.data = `Ação inválida!`
      } else {
        resp.data = `Nenhuma ação informada! ${action}`
      }

      resp.success = false
      return resp
  }

  try {
    operationResponse = await context.functions.execute(operationName, operationParameters)
  } catch (e) {
      success = false
      operationResponse = e.message
  }

  resp.success = success                                                //if we got to this point success should be true
  resp.data = operationResponse
  return resp
};