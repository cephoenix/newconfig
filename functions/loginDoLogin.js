exports = async function(payload){
  let login;
  let password;
  let parameters;
  
  try {
    parameters = EJSON.parse(payload)
  } catch (e) {
    throw (e)
  }
  
  

  login = parameters.login;
  password = parameters.password;
  
  let users = await context.functions.execute("usersFindMany", login)
  let retrievedPassword = await context.functions.execute("decryptText", password)

  return { users: users, password: retrievedPassword };
}
