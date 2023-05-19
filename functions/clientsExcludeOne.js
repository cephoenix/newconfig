exports = async function(payload){


  let dbResponse;
  let resp = {};
  let query;
  let parameters;
  const dbquery = context.services.get("mongodb-atlas").db("configRadio").collection("clients"); 
  
    if(payload) {
    try {
      parameters = EJSON.parse(payload.text())
    } catch (e) {
      throw (e)
    }
  } else {
    let err = new Error();
    err.name = 'no_data_provided'
    err.message = "Não é possível excluir um registro em branco";
    err.code = 2;
    err.TypeError = 2;
    throw err;
  }

  parameters.exclusionDate = 
  query = {"_id": new BSON.ObjectId(parameters._id)}
  try {
    dbResponse = await dbquery.updateOne(
      query, 
      {$set: {exclusionDate : new Date()}}, 
      { upsert: false })
  } catch (e) {
    throw (e)
  }

  return dbResponse

}