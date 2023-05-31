exports = async function (data) {

  let dbResponse;
  let resp = {};
  let query;
  const dbquery = context.services.get("mongodb-atlas").db("configRadio").collection("users");

  if (data) {
    try {
      parameters = EJSON.parse(data)
    } catch (e) {
      throw (e)
    }
  } else {
    throw "Não é possível atualizar um registro em branco";
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