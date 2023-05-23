exports = async function (data) {
return {debug: data}
  let parameters;
  
  if (data.query) {
    try {
      parameters = EJSON.parse(data.query)
    } catch (e) {
      throw (e)
    }
  } else {
    let err = new Error();
    err.name = 'no_data_provided'
    err.message = "Não é possível buscar por um registro em branco";
    err.code = 2;
    err.TypeError = 2;
    throw err;
  }

  const dbquery = context.services.get("mongodb-atlas").db("configRadio").collection(data.collection);

  try {
    return await dbquery.findOne(parameters)
  } catch (e) {
    let err = new Error();
    err.name = 'find_one_error'
    err.message = "Não é possível buscar " + data.collection;
    err.code = 2;
    err.TypeError = 2;
    err.e = e
    throw e;
  }
};