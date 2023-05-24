exports = async function (data) {

  let parameters;
  
  if (data.query) {
    try {
      parameters = EJSON.parse(data.query)
    } catch (e) {
      throw (e)
    }
  } else {
    let err = new Error();
    err.message = "Não é possível buscar por um registro em branco";
    throw err;
  }

  const dbquery = context.services.get("mongodb-atlas").db("configRadio").collection(data.collection);

  try {
    return await dbquery.findMany(parameters)
  } catch (e) {
    let err = new Error();
    err.message = "Não é possível buscar " + data.collection;
    throw err;
  }
};