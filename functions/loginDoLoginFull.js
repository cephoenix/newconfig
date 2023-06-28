/* eslint-disable no-undef */
// eslint-disable-next-line n/no-exports-assign
exports = async function (data) {
  let parameters
  let dbResponse

  if (data == null) {
    throw new Error('É necessário fornecer informações válidas para autenticação!')
  }

  try {
    parameters = JSON.parse(data.text())
  } catch (e) {
    throw new Error('É necessário fornecer informações válidas para autenticação!')
  }

  if (parameters.login == null || parameters.encryptedPassword == null) {
    throw new Error('É necessário fornecer informações válidas para autenticação!')
  }

  try {
    dbResponse = await context.functions.execute('databaseFindOne', { query: EJSON.stringify({ login: parameters.login }), collection: 'users' })
  } catch (e) {
    throw new Error(`Erro ao buscar usuário no Banco de Dados! ${e}`)
  }

  if (dbResponse == null) {
    throw new Error('Senha ou usuário incorretos!')
  }

  const decryptedPassword = await context.functions.execute('decryptText', parameters.encryptedPassword) // Decriptografa a senha e depois aplica o hash nela
  const hashedPass = await context.functions.execute('encryptPassword', decryptedPassword)

  if (dbResponse.password !== hashedPass) {
    throw new Error('Senha ou usuário incorretos!')
  }
  // return {debug: true, dbResponse: dbResponse, clientsLength: dbResponse.clients.length, firstElement: dbResponse.clients[0]}
  // for (let i = 0; i < dbResponse.clients.length; i++) {
  //   // const client = array[i];
  //   dbResponse.radios = await context.functions.execute("radiosFindMany", {"clientOID":dbResponse.clients[i]})
  // }

  return { sessionId: 'A52B7A89FE6A3BA58D8C', loggedUser: dbResponse } // @todo implementar mecanismo de sessão
}
