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
  let rawPassword = await context.functions.execute("decryptText", parameters.password)
  let encryptedPassword = await context.functions.execute("encryptPassword", rawPassword)
  return {db: dbResponse.password, param: encryptedPassword, paramDecrypted: rawPassword, debug2: await context.functions.execute("encryptPassword", 'MinhaSenha')}
  
  if(dbResponse.password == parameters.password) {
    return true;
  }
  
  return false;
}
