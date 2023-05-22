exports = async function(payload){
  let login;
  let password;

  parameters = EJSON.parse(payload)

  login = parameters.login;
  password = parameters.password;
  
  let users = await context.functions.execute("usersFindMany", login)
  let retrievedPassword = await context.functions.execute("decryptText", password)

  return { users: users, password: retrievedPassword };
}
