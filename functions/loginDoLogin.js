exports = async function(data){
  let login;
  let password;
  let parameters;
  let users;

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
  users = await context.functions.execute("usersFindMany", EJSON.stringify({login: login}))
  
  return { users: users, length: users.length, size: users.size };
}
