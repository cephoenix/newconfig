exports = async function(data){
  const dbquery = context.services.get("mongodb-atlas").db("configRadio").collection("radios"); 
  let parameters

  if(data) {
    try {
      parameters = EJSON.parse(data)
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