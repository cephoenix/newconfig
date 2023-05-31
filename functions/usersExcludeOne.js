exports = async function (data) {


  let dbResponse;
  let resp = {};
  let query;
  let parameters;
  const dbquery = context.services.get("mongodb-atlas").db("configRadio").collection("users");

  if (data) {
    try {
      parameters = EJSON.parse(data)
    } catch (e) {
      throw (e)
    }
  } else {
    throw "Não é possível excluir um registro em branco";
  }

  parameters.exclusionDate =
    query = { "_id": new BSON.ObjectId(parameters._id) }
  try {
    dbResponse = await dbquery.updateOne(
      query,
      { $set: { exclusionDate: new Date() } },
      { upsert: false })
  } catch (e) {
    throw (e)
  }

  return dbResponse
}