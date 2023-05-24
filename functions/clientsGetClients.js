exports = async function (data) {
  const dbquery = context.services.get("mongodb-atlas").db("configRadio").collection("clients");

  
  
  try {
    parameters = EJSON.parse(data)
  } catch (e) {
    let err = new Error()
    err.message = "Falha ao buscar o ID da sessão de usuário!"
    throw err
  }
  
  try {
    return {debug: parameters}
    dbResponse = await dbquery.find(parameters)
  } catch (e) {
    throw (e)
  }

  return dbResponse;
};