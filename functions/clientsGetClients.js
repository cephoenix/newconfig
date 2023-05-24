exports = async function (data) {
  const dbquery = context.services.get("mongodb-atlas").db("configRadio").collection("clients");

  
  
  try {

    parameters = EJSON.parse(data)
    return {debug: parameters}
  } catch (e) {
    let err = new Error()
    err.message = "Id da sessão de usuário inválido"
    throw err
  }
  
  try {
    dbResponse = await dbquery.find(parameters)
  } catch (e) {
    throw (e)
  }

  return dbResponse;
};