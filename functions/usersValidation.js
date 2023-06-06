exports = async function (payload) {

  const dbquery = context.services.get("mongodb-atlas").db("configRadio").collection("users");
  let action;
  var success = true;
  let operationName;
  var operationResponse
  var resp = {}
  var operationParameters = {};

  /**
 * Ao atualizar um rádio a resposta vai ser o cliente desse rádio com o resumo de dispositivos atualizado
 */



  operationParameters.collection = `users`

  switch (action) {
    case 'create':
      validateCreate(payload)
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

async function validateCreate(payload) {


  try {
    parameters = EJSON.parse(data)
  } catch (e) {
    throw `Erro ao criar usuário:  ${e}`
  }

  if(!parameters.exhibitionName) {
    throw "O campo 'Nome de exibição' é obrigatório!";
  }

  if(!parameters.permissionLevel) {
    throw "O campo 'Nível de permissão' é obrigatório!"
  }

  query = {
    $or: [
      { "login": parameters.login },
      { "cpfCnpj": parameters.cpfCnpj }
    ]
  }

  try {
    dbResponse = await context.functions.execute('databaseFindMany', { query: query, collection: `clients` })
  } catch (e) {
    throw `Erro ao buscar usuário: ${e}`
  }

  if(dbResponse != undefined) {
    throw `Usuário já existe`
  }

  // try {

  //   dbResponse = await dbquery.findOne(query)
  // } catch (e) {
  //   throw `Não foi possível criar usuário: ${e}`;
  // }
}