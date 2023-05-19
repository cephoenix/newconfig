exports = async function(payload){

  let dbResponse;
  let resp = {};
  let query;
  let parameters;
  const dbquery = context.services.get("mongodb-atlas").db("configRadio").collection("users"); 
  
  
  if(payload) {
    try {
      parameters = EJSON.parse(payload.text())
    } catch (e) {
      throw (e)
    }
  } else {
    let err = new Error();
    err.name = 'no_data_provided'
    err.message = "Não é possível adicionar um registro em branco";
    err.code = 2;
    err.TypeError = 2;
    throw err;
  }

  query = {
    $or: [
      {"login": parameters.login},
      {"cpfCnpj": parameters.cpfCnpj}
    ]
  }

// return {"debug":parameters}
  try {
    dbResponse = await dbquery.findOne(query)
  } catch (e) {
    throw ("Não encontrou usuário", query)
  }

  
  if(!dbResponse) {
    try {
      dbResponse = await dbquery.insertOne(parameters);
    } catch(e) {
      throw "Erro: " + e;
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