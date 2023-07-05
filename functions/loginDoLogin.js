/* eslint-disable no-undef */
// eslint-disable-next-line n/no-exports-assign
exports = async function (payload) {
  let parameters
  let loggedUser
  const data = payload.body
  const remoteIp = payload.headers['X-Cluster-Client-Ip'][0]



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

  let databaseParameters = {
    action: 'findMany',
    collection: 'deviceTypes',
    query: {
      class: {
        $ne: '6'
      }
    },
    filter: {}
  }

  const deviceTypes = await context.functions.execute('databaseControl', databaseParameters)

  databaseParameters = {
    action: 'findOne',
    collection: 'parameters',
    query: { name: 'softwareVersion' },
    filter: {}
  }

  const softwareVersion = await context.functions.execute('databaseControl', databaseParameters)

  return {
    sessionId: 'A52B7A89FE6A3BA58D8C',
    loggedUser,
    deviceTypes,
    softwareVersion: softwareVersion.value
  } // @todo implementar mecanismo de sessão
}

/**
 * Load device types from Bubble API
 */
async function loadDeviceTypes () {
  let dbDeviceTypes

  databaseParameters = {
    action: 'findMany',
    collection: 'deviceTypes',
    filter: { },
    query: { },
    options: { }
  }

  try {
    dbDeviceTypes = await context.functions.execute('databaseControl', databaseParameters)
  } catch (error) {
    throw new Error(`Ocorreu um erro ao buscar os Tipos de Dispositivo! ${error}`)
  }

  // try {
  //   dbDeviceTypes = await context.services.get('mongodb-atlas').db('configRadio').collection('deviceTypes').find({ initials: `${initials}` })
  //   dbDeviceTypes = await dbDeviceTypes.toArray()
  // } catch (e) {
  //   throw new Error(`Ocorreu um problema ao buscar os tipos de dispositivo ${e}`)
  // }

  // try {
  //   deviceTypes.forEach(type => {
  //     if (type.initials === initials) {
  //       typeToReturn = type
  //     }
  //   })
  // } catch (e) {
  //   throw new Error(`Não foi possível buscar a lista de Tipos de Dispositivo. ${e}`)
  // }

  const requestResponse = await context.http.get({
    url: 'https://app.firebee.com.br/api/1.1/obj/Products/',
    requestHeaders: {
      'Content-Type': ['application/json'],
      Authorization: 'Bearer 0b6336226cbe51d8b47e2f04b70de602'
    },
    body: {},
    encodeBodyAsJSON: true
  })

  const deviceTypes = await JSON.parse(requestResponse.body.text()).response.results

  // Tentando buscar o tipo de dispositivo nos resultados encontrados
  const deviceTypesToInsert = []
  deviceTypes.forEach(element => {
    if (dbDeviceTypes.some(type => type.hasOwnProperty(element.SiglaConfRadio))) {
      deviceTypesToInsert.push(element)
    }
  })

  databaseParameters = {
    action: 'insertMany',
    collection: 'deviceTypes',
    filter: { },
    query: { deviceTypesToInsert },
    options: { upsert: false }
  }

  try {
    await context.functions.execute('databaseControl', databaseParameters)
  } catch (error) {
    throw new Error(`Ocorreu um erro ao inserir os Tipos de Dispositivo! ${error}`)
  }
}

if (typeof module === 'object') {
  module.exports = exports
}
