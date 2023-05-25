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
      throw (e)
    }
  } else {
    let err = new Error()
    err.message = "Não é possível adicionar um registro em branco"
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
    dbResponse = await context.functions.execute('databaseFindOne', { query: EJSON.stringify(parameters), collection: "clients" });
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