exports = async function (data) {
  var parameters;
  var dbResponse;

  if(data == undefined) {
    throw "É necessário fornecer informações válidas para autenticação! (1)"
  }
  
  if (data == null) {
    throw "É necessário fornecer informações válidas para autenticação! (2)"
  }

  try {
    parameters = JSON.parse(data.text())
  } catch (e) {
    throw "É necessário fornecer informações válidas para autenticação! (3)"
  }

  if(parameters.login == null || parameters.encryptedPassword == null) {
    throw "É necessário fornecer informações válidas para autenticação! (4)"
  }

  if(parameters.login == undefined || parameters.encryptedPassword == undefined) {
    throw "É necessário fornecer informações válidas para autenticação! (5)"
  }

  try {
    dbResponse = await context.functions.execute('databaseFindOne', { query: EJSON.stringify({ login: parameters.login }), collection: "users" });
  } catch (e) {
    throw "Erro ao buscar usuário no Banco de Dados! " + e
  }

  if(dbResponse == null) {
    throw "Senha ou usuário incorretos!"
  }
  
  let decryptedPassword = await context.functions.execute("decryptText", parameters.encryptedPassword) ///Decriptografa a senha e depois aplica o hash nela
  let hashedPass = await context.functions.execute("encryptPassword", decryptedPassword)

  if (dbResponse.password !== hashedPass) {
    throw "Senha ou usuário incorretos!"
  }
// return {debug: true, dbResponse: dbResponse, clientsLength: dbResponse.clients.length, firstElement: dbResponse.clients[0]}
  for (let i = 0; i < dbResponse.clients.length; i++) {
    // const client = array[i];
    dbResponse.radios = await context.functions.execute("radiosFindMany", {"clientOID":array[i]})
  }

  return { "sessionId": "A52B7A89FE6A3BA58D8C" , loggedUser: dbResponse}  //@todo implementar mecanismo de sessão
}