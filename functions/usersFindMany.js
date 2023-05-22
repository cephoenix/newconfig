exports = async function(data){
  const dbquery = context.services.get("mongodb-atlas").db("configRadio").collection("users"); 
  let parameters

  if(data) {
    try {
      parameters = EJSON.parse(data)
      return {debug2: parameters}
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