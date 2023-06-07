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
      validateCreate(payload)
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

async function validateCreate (payload) {
  var parameters
  if(payload.body == undefined || payload.body == "" || payload.body == null) {
    throw `Dados inválidos!`
  } else {
    try {
      parameters = JSON.parse(payload.body.text())
    } catch (error) {
      throw `Dados inválidos. Erro: ${error}`
    }
  }

  if(await isEmpty(parameters.initials)) {
    throw `É necessário fornecer as iniciais do Cliente!`
  }

  if(await isEmpty(parameters.cpfCnpj)) {
    throw `É necessário fornecer o CPF/CNPJ do Cliente!`
  }

  if(await isEmpty(parameters.networkKey)) {
    throw `É necessário fornecer a Chave de Rede (Network Key) do Cliente!`
  }

  if(await isEmpty(parameters.panId)) {
    throw `É necessário fornecer o PAN ID do Cliente!`
  }

  query = {
    $or: [
      { "initials": parameters.initials },
      { "cpfCnpj": parameters.cpfCnpj },
      { "networkKey": parameters.networkKey },
      { "panId": parameters.panId }
    ]
  }

  try {
    dbResponse = await context.functions.execute(`databaseFindOne`, { query: EJSON.stringify(query), collection: `clients` });
  } catch (e) {
    throw (e)
  }

  if (await isEmpty(dbResponse)) {
    try {
      dbResponse = await dbquery.insertOne(parameters);
    } catch (e) {
      throw e;
    }
    return dbResponse
  } else {
    throw `Cliente já cadastrado`
  }
}

async function isEmpty (data) {
  return data != undefined && data != `` && data != null
}