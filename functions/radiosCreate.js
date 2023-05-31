exports = async function (data) {

  let dbResponse;
  let resp = {};
  let query;
  let parameters;
  const dbquery = context.services.get("mongodb-atlas").db("configRadio").collection("radios");

  if (data) {
    try {
      parameters = EJSON.parse(data)
    } catch (e) {
      throw (e)
    }
  } else {
    throw "Não é possível adicionar um registro em branco";
  }

  query = {
    $or: [
      { "address64Bits": parameters.address64Bits }
    ]
  }

  try {
    dbResponse = await dbquery.findOne(query)
  } catch (e) {
    throw "Não é possível buscar rádio"
  }


  if (!dbResponse) {
    try {
      dbResponse = await dbquery.insertOne(parameters);
    } catch (e) {
      throw "Erro: " + e;
    }

    return dbResponse

  } else {
    throw "Rádio já cadastrado"
  }

};