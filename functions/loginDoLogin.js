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

  dbResponse = await context.functions.execute("usersFindOne", EJSON.stringify({ login: parameters.login }))

  if(dbResponse === null) {
    return {debug: true}
    let err = new Error()
    err.message = "Usuário inexistente!"
    throw err.message
  }

  let decryptedPassword = await context.functions.execute("decryptText", parameters.encryptedPassword) ///Decriptografa a senha e depois aplica o hash nela
  let hashedPass = await context.functions.execute("encryptPassword", decryptedPassword)

  if (dbResponse.password !== hashedPass) {
    let err = new Error()
    err.message = "Senha incorreta!"
    throw err.message
  }

  return { "sessionId": "A52B7A89FE6A3BA58D8C" }
}