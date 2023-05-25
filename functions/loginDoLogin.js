exports = async function (data) {
  var parameters;
  var dbResponse;
  var resp;

  return {debug: data}
  if(data == undefined) {
    resp.success = false
    resp.data = "Favor informar dados válidos!"
    return resp
  }

  if (data === null) {
    throw "É necessário fornecer informações válidas para autenticação!"
  }

  try {
    parameters = JSON.parse(data.text())
  } catch (e) {
    resp.success = false
    resp.data = "Favor informar dados válidos (2)!"
    return resp
  }

  // if (data) {
  //   try {
  //     parameters = EJSON.parse(data)
  //   } catch (e) {
  //     throw "Não é possível fazer login. Verifique as credenciais informadas."
  //   }
  // } else {
  //   throw "Não é possível fazer login sem informações"
  // }
  
  try {
    dbResponse = await context.functions.execute('databaseFindOne', { query: EJSON.stringify({ login: parameters.login }), collection: "users" });
  } catch (e) {
    throw e;
  }

  if(dbResponse == null) {
    throw "Senha ou usuário incorretos!"
  }
  
  let decryptedPassword = await context.functions.execute("decryptText", parameters.encryptedPassword) ///Decriptografa a senha e depois aplica o hash nela
  let hashedPass = await context.functions.execute("encryptPassword", decryptedPassword)

  if (dbResponse.password !== hashedPass) {
    throw "Senha ou usuário incorretos!"
  }

  return { "sessionId": "A52B7A89FE6A3BA58D8C" }  //@todo implementar mecanismo de sessão
}