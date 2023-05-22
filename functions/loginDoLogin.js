exports = async function(payload){
  let login;
  let password;

  let message = "MinhaSenha";
  
  let encMessage = await context.functions.execute("encryptText", message);
  parameters = EJSON.parse(payload.text())

  login = parameters.login;
  password = parameters.password;

  return { login: login, password: await context.functions.execute("decryptText", password)};
}
