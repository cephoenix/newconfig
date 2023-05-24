exports = async function (data) {
  const dbquery = context.services.get("mongodb-atlas").db("configRadio").collection("clients");

  
  
  try {

    parameters = EJSON.parse(data)
    return {debug: parameters}
  } catch (e) {
    return {debug: e}
    throw (e)
  }
  
  try {
    dbResponse = await dbquery.find(parameters)
  } catch (e) {
    throw (e)
  }

  return dbResponse;
};