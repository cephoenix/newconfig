exports = async function (data) {
  const dbquery = context.services.get("mongodb-atlas").db("configRadio").collection("users");

  if (data) {
    try {
      parameters = EJSON.parse(data)
    } catch (e) {
      throw (e)
    }
  } else {
    throw "Não é possível pesquisar por um registro em branco";
  }

  return {debug: parameters}
  try {
    dbResponse = await dbquery.findOne(parameters)
  } catch (e) {
    throw (e)
  }

  return dbResponse;
};