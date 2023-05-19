exports = async function(payload){
  const dbquery = context.services.get("mongodb-atlas").db("configRadio").collection("clients"); 

  if(payload) {
    try {
      parameters = EJSON.parse(payload.text())
    } catch (e) {
      throw (e)
    }
  } else {
    parameters = {}
  }

  try {
    dbResponse = await dbquery.find(parameters)
  } catch (e) {
    throw (e)
  }

  return dbResponse;
};