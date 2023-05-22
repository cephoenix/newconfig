exports = async function(payload, response){
  let login;
  let password;

  let message = "MinhaSenha";
  
  let encMessage = await context.functions.execute("encryptText", message);
  
  
  return {minhasenha: "encMessage", password: payload.password}
  // console.log("DEBUG ENC: ", encMessage)
  
  // console.log("DEBUG DEC: ", await context.functions.execute("decryptText", encMessage))

  try {
    login = payload.query.login;
    password = payload.query.password;
  } catch(err) {
    login = payload.login;
    password = payload.password;
  }
  return { login: login, password: await context.functions.execute("decryptText", password)};
};
