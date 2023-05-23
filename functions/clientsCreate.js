exports = async function (data) {

  let dbResponse;
  let resp = {};
  let query;
  let parameters;
  const dbquery = context.services.get("mongodb-atlas").db("configRadio").collection("clients");



  if (data) {
    
    try {
      parameters = EJSON.parse(data)
    } catch (e) {
      return {if:data}
      throw (e)
    }
  } else {
    return {else: data}
    let err = new Error()
    err.name = 'no_data_provided'
    err.message = "Não é possível adicionar um registro em branco"
    err.code = 2
    err.TypeError = 2
    throw err
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
    operationResponse = await context.functions.execute('databaseFindOne', EJSON.stringify({ query: parameters, collection: "clients" }));
    dbResponse = await dbquery.findOne(query)
  } catch (e) {
    throw (e)
  }

  if (!dbResponse) {
    try {
      dbResponse = await dbquery.insertOne(parameters);
    } catch (e) {
      throw e;
    }
    return dbResponse
  } else {
    let err = new Error();
    err.name = 'client_already_exists'
    err.message = "Cliente já cadastrado";
    err.code = 1;
    err.TypeError = 1;
    throw err;
  }

};