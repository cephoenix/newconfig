exports = async function (data) {
  let parameters;
  let dbResponse;

  if (data) {
    try {
      parameters = EJSON.parse(data)
    } catch (e) {
      let err = new Error()
      err.message = "Não é possível fazer login. Verifique as credenciais informadas."
      throw err
    }
  } else {
    let err = new Error()
    err.message = "Não é possível fazer login sem informações"
    throw err
  }

  try {
    dbResponse = await context.functions.execute('databaseFindOne', { query: EJSON.stringify({ login: parameters.login }), collection: "users" });
  } catch (e) {
    return {debug2: {"dbresponse": dbResponse, "e: ": e}
    // throw "Erro ao buscar usuário!";
  }

  

  if(dbResponse === null) {
    let err = new Error()
    err.message = "Senha ou usuário incorretos!"
    throw err
  }
  
  let decryptedPassword = await context.functions.execute("decryptText", parameters.encryptedPassword) ///Decriptografa a senha e depois aplica o hash nela
  let hashedPass = await context.functions.execute("encryptPassword", decryptedPassword)

  if (dbResponse.password !== hashedPass) {
    throw "Senha ou usuário incorretos!"
  }

  return { "sessionId": "A52B7A89FE6A3BA58D8C" }  //@todo implementar mecanismo de sessão
}