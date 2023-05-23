exports = async function(data){
  let parameters;
  let dbResponse;

  if(data) {
    try {
      parameters = EJSON.parse(data)
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

  dbResponse = await context.functions.execute("usersFindOne", EJSON.stringify({login: parameters.login}))


  // return {debug: await context.functions.execute("encryptPassword", parameters.rawPassword)}
  let hashedPass = await context.functions.execute("encryptPassword", parameters.password)
  let encryptedPassword = await context.functions.execute("encryptText", "ALKNTLGHAYGSAGGGAGAÇLJKHOPIALS", parameters.password)
  let decryptedPassword = await context.functions.execute("decryptText", "ALKNTLGHAYGSAGGGAGAÇLJKHOPIALS", parameters.encryptedPassword)

  //Senha decryptografada enviada pelo frontend
  // let rawPassword = await context.functions.execute("decryptText", "mysalt", parameters.password)
  
  //Senha encryptada para ser comparada à senha que foi gravada no Banco De Dados
  
  
  
  return {
    password: parameters.password,
    hashedPass: hashedPass,
    encryptedPassword: encryptedPassword.toHex().toUpperCase(),
    decryptedPassword: decryptedPassword.toHex().toUpperCase()
  }
  
  if(dbResponse.password == parameters.password) {
    return true;
  }
  
  return false;
}
