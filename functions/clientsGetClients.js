exports = async function (data) {
  const dbquery = context.services.get("mongodb-atlas").db("configRadio").collection("clients");
  try {
    parameters = EJSON.parse(data)
  } catch (e) {
    let err = new Error()
    err.message = "Falha ao buscar o ID da sessão de usuário!"
    throw err
  }

  if(parameters.sessionId === "A52B7A89FE6A3BA58D8C") {
    try {
      return {debug: true}
      dbResponse = await dbquery.find({})
      return dbResponse;
    } catch (e) {
      throw (e)
    }
  } else {
    let err = new Error()
    err.message = "É necessário realizar login para ter acesso a esse recurso do sistema!"
    throw err
  }
};