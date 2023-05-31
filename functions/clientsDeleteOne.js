exports = async function (data) {

  let dbResponse;
  let query;
  let parameters;
  const dbquery = context.services.get("mongodb-atlas").db("configRadio").collection("clients");

  if (data) {
    try {
      parameters = EJSON.parse(data)
    } catch (e) {
      throw (e)
    }
  } else {
    throw "Não é possível excluir um registro em branco"
  }

  query = { "_id": new BSON.ObjectId(parameters._id) }
  try {
    dbResponse = await dbquery.deleteOne(query)
  } catch (e) {
    throw (e)
  }

  return dbResponse
}