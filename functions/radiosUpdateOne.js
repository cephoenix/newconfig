exports = async function (data) {

  let dbResponse;
  let resp = {};
  let query;
  const dbquery = context.services.get("mongodb-atlas").db("configRadio").collection("radios");


  if (data) {
    try {
      parameters = EJSON.parse(data)
    } catch (e) {
      throw (e)
    }
  } else {
    let err = new Error();
    err.name = 'no_data_provided'
    err.message = "Não é possível atualizar um registro em branco";
    err.code = 3;
    err.TypeError = 3;
    throw err;
  }
  // query = {"_id": new BSON.ObjectId(parameters._id)}
  query = { "_id": parameters._id }

  try {
    dbResponse = await dbquery.updateOne(query, parameters, { upsert: false })
  } catch (e) {
    throw (e)
  }

  return dbResponse

};