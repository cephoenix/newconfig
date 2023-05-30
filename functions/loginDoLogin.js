exports = async function (payload) {
  var parameters;
  var loggedUser;
  var data = payload.body

  return { remoteIp: payload.headers['x-forwarded-for']}

  if (data == undefined) {
    throw "É necessário fornecer informações válidas para autenticação! (1)"
  }

  if (data == null) {
    throw "É necessário fornecer informações válidas para autenticação! (2)"
  }

  try {
    parameters = JSON.parse(data.text())
  } catch (e) {
    throw "É necessário fornecer informações válidas para autenticação! (3)"
  }

  if (parameters.login == null || parameters.encryptedPassword == null) {
    throw "É necessário fornecer informações válidas para autenticação! (4)"
  }

  if (parameters.login == undefined || parameters.encryptedPassword == undefined) {
    throw "É necessário fornecer informações válidas para autenticação! (5)"
  }
  
  try {
    loggedUser = await context.functions.execute('databaseFindOne',
      {
        query: EJSON.stringify({ login: parameters.login }),
        options: EJSON.stringify({ projection: { _id: 0, password: 0 } }),
        collection: "users"
      });
  } catch (e) {
    throw "Erro ao buscar usuário no Banco de Dados! " + e
  }
  
  if (loggedUser == null) {
    throw "Senha ou usuário incorretos!"
  }

  let decryptedPassword = await context.functions.execute("decryptText", parameters.encryptedPassword) ///Decriptografa a senha e depois aplica o hash nela
  let hashedPass = await context.functions.execute("encryptPassword", decryptedPassword)
  
  const dbquery = context.services.get("mongodb-atlas").db("configRadio").collection("usersLoginLog")

  if (loggedUser.password !== hashedPass) {

    try {
      await dbquery.insertOne({user: {login : parameters.login}, success: false, date: new Date()})
    } catch (e) {
      throw (e)
    }

    throw "Senha ou usuário incorretos!"
  }
  
  try {
    // return {dbResponse: loggedUser, loggedUser: dbResponse.loggedUser}
    await dbquery.insertOne({user: loggedUser._id, sessionId: loggedUser.sessionId, success: true, date: new Date()})
  } catch (e) {
    throw (e)
  }


  return { "sessionId": "A52B7A89FE6A3BA58D8C", loggedUser: loggedUser }  //@todo implementar mecanismo de sessão
}