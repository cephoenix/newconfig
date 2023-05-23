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
  let encPass = await context.functions.execute("encryptText", parameters.rawPassword)
  return {
    debug: encPass, 
    rawPassword: parameters.rawPassword,
    dectyptedText: await context.functions.execute("decryptText", encPass)
  }
  
  //Senha decryptografada enviada pelo frontend
  let rawPassword = await context.functions.execute("decryptText", parameters.password)
  
  //Senha encryptada para ser comparada à senha que foi gravada no Banco De Dados
  let encryptedPassword = await context.functions.execute("encryptPassword", rawPassword)
  
  
  return {rawPassword: rawPassword, dbPassword: dbResponse.password, param: encryptedPassword,  encryptedRaw: await context.functions.execute("encryptPassword", rawPassword)}
  
  if(dbResponse.password == parameters.password) {
    return true;
  }
  
  return false;
}
