exports = async function(payload){
  let login;
  let password;
  let parameters;

  if(payload) {
    try {
      parameters = EJSON.parse(payload.text())
    } catch (e) {
      throw (e)
    }
  } else {
    let err = new Error()
    err.name = 'no_data_provided'
    err.message = "Não é possível fazer login sem informações"
    err.code = 2
    err.TypeError = 2
    throw err
  }
return {debug: parameters}
  login = parameters.login;
  password = parameters.password;
  
  let users = await context.functions.execute("usersFindMany", login)
  let retrievedPassword = await context.functions.execute("decryptText", password)

  return { users: users, password: retrievedPassword };
}
