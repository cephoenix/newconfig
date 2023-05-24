exports = async function (data) {
  let parameters;
  let dbResponse;

  if (data) {
    try {
      parameters = EJSON.parse(data)
    } catch (e) {
      throw (e)
    }
  } else {
    let err = new Error()
    err.message = "Não é possível fazer login sem informações"
    throw err
  }
  return {debug: true}

  dbResponse = await context.functions.execute('databaseFindOne', { query: EJSON.stringify({ login: parameters.login }), collection: "users" });

  if(dbResponse === null) {
    let err = new Error()
    err.message = "Senha ou usuário incorretos!"
    throw err
  }

  let decryptedPassword = await context.functions.execute("decryptText", parameters.encryptedPassword) ///Decriptografa a senha e depois aplica o hash nela
  let hashedPass = await context.functions.execute("encryptPassword", decryptedPassword)

  if (dbResponse.password !== hashedPass) {
    let err = new Error()
    err.message = "Senha ou usuário incorretos!"
    throw err
  }

  return { "sessionId": "A52B7A89FE6A3BA58D8C" }  //@todo implementar mecanismo de sessão
}