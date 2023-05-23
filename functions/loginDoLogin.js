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
  
  let encryptedPassword = await context.functions.execute("encryptText", "ALKNTLGHAYGSAGGGAGAÇLJKHOPIALS", parameters.password)
  let decryptedPassword = await context.functions.execute("decryptText", "ALKNTLGHAYGSAGGGAGAÇLJKHOPIALS", parameters.encryptedPassword)
  let hashedPass = await context.functions.execute("encryptPassword", decryptedPassword)
  //Senha decryptografada enviada pelo frontend
  // let rawPassword = await context.functions.execute("decryptText", "mysalt", parameters.password)
  
  //Senha encryptada para ser comparada à senha que foi gravada no Banco De Dados
  
  

  
  if(dbResponse.password == hashedPass) {
    return {
      password: parameters.password,
      hashedPass: hashedPass,
      encryptedPassword: encryptedPassword,
      decryptedPassword: decryptedPassword,
      dbResponse: dbResponse
    }
  } 
  
  let err = new Error()
  err.name = 'invalid_password'
  err.message = "Senha incorreta!"
  err.code = 2
  err.TypeError = 2
  throw err
}
