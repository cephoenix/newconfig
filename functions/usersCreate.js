exports = async function (data) {

  var password;
  var dbResponse;
  var resp = {};
  var query;
  var parameters;
  const dbquery = context.services.get("mongodb-atlas").db("configRadio").collection("users");

  if (data) {
    try {
      parameters = EJSON.parse(data)
    } catch (e) {
      throw (e)
    }
  } else {
    let err = new Error();
    err.message = "Não é possível adicionar um registro em branco";
    throw err;
  }

  query = {
    $or: [
      { "login": parameters.login },
      { "cpfCnpj": parameters.cpfCnpj }
    ]
  }

  try {
    dbResponse = await dbquery.findOne(query)
  } catch (e) {
    let err = new Error();
    err.message = "Não é possível buscar usuário";
    err.e = e
    throw e;
  }


  if (!dbResponse) {
    try {
      let password = await context.functions.execute("decryptText", parameters.password);
    } catch (e) {
      throw "Erro ao decriptografar a senha enviada pelo frontend: " + e;
    }

    try {
      parameters.password = await context.functions.execute("encryptPassword", password);
    } catch (e) {
      throw "Erro ao encriptar a senha a ser gravad no Banco de Dados: " + e;
    }

    try {
      dbResponse = await dbquery.insertOne(parameters);
    } catch (e) {
      throw "Erro ao inserir registro no Banco de Dados: " + e;
    }

    return dbResponse
  } else {
    throw "Usuário já cadastrado";
  }

};