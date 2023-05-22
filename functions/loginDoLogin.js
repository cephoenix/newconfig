exports = async function(data){
  let login;
  let password;
  let parameters;

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

  login = parameters.login;
  password = parameters.password;
  // return {debug: parameters}  
  let query = {login: login}
  let users = await context.functions.execute("usersFindMany", query.text)

  return { users: users };
}
