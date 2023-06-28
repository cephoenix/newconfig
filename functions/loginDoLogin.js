/* eslint-disable no-undef */
// eslint-disable-next-line n/no-exports-assign
exports = async function (payload) {
  let parameters
  let loggedUser
  const data = payload.body
  const remoteIp = payload.headers['X-Cluster-Client-Ip'][0]

  if (data === undefined) {
    throw new Error('É necessário fornecer informações válidas para autenticação!')
  }

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

  if (parameters.login === undefined || parameters.encryptedPassword === undefined) {
    throw new Error('É necessário fornecer informações válidas para autenticação!')
  }

  try {
    loggedUser = await context.services.get('mongodb-atlas').db('configRadio').collection('users').findOne({ login: parameters.login })
  } catch (e) {
    throw new Error(`Erro ao buscar usuário no Banco de Dados! ${e}`)
  }

  if (loggedUser == null) {
    throw new Error('Senha ou usuário incorretos!')
  }

  const decryptedPassword = await context.functions.execute('decryptText', parameters.encryptedPassword) // Decriptografa a senha e depois aplica o hash nela
  const hashedPass = await context.functions.execute('encryptPassword', decryptedPassword)

  const dbquery = context.services.get('mongodb-atlas').db('configRadio').collection('usersLoginLog')

  if (loggedUser.password !== hashedPass) {
    await dbquery.insertOne({ login: parameters.login, success: false, clientIp: remoteIp, date: new Date(), reason: 'Senha incorreta' })
    throw new Error('Senha ou usuário incorretos!')
  }

  if (loggedUser.blocked) {
    await dbquery.insertOne({ login: parameters.login, success: false, clientIp: remoteIp, date: new Date(), reason: 'Usuário bloqueado' })
    throw new Error('Usuário bloqueado!')
  }

  await dbquery.insertOne({ login: parameters.login, success: true, clientIp: remoteIp, date: new Date() })

  const databaseParameters = {
    action: 'findMany',
    collection: 'deviceTypes',
    query: {},
    filter: {}
  }

  return {
    sessionId: 'A52B7A89FE6A3BA58D8C',
    loggedUser: loggedUser,
    deviceTypes: await context.functions.execute('databaseControl', databaseParameters)
  } // @todo implementar mecanismo de sessão
}
