exports = async function(payload){
  let login;
  let password;

  parameters = EJSON.parse(payload.text())

  login = parameters.login;
  password = parameters.password;

  return { login: login, password: await context.functions.execute("decryptText", password)};
}
