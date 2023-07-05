/* eslint-disable no-undef */
// eslint-disable-next-line n/no-exports-assign
exports = async function (payload) {

  payload = {
            "query": {
                "action": "doLogin"
            },
            "headers": {
                "Content-Type": [
                    "application/json"
                ],
                "X-Request-Id": [
                    "1ddc7662-3951-4d27-9ab9-dc54179a82a7"
                ],
                "Authorizationkey": [
                    "645e4f0a833b23298defbed9"
                ],
                "Postman-Token": [
                    "3dd5cadf-c789-49b4-b2eb-fb2255fa32e8"
                ],
                "Content-Length": [
                    "82"
                ],
                "X-Forwarded-Proto": [
                    "https"
                ],
                "X-Envoy-External-Address": [
                    "179.73.185.92"
                ],
                "Accept": [
                    "*/*"
                ],
                "Accept-Encoding": [
                    "gzip, deflate, br"
                ],
                "X-Forwarded-For": [
                    "179.73.185.92"
                ],
                "X-Cluster-Client-Ip": [
                    "179.73.185.92"
                ],
                "User-Agent": [
                    "PostmanRuntime/7.32.3"
                ],
                "X-Forwarded-Client-Cert": [
                    "By=spiffe://xgen-prod/ns/baas-prod/sa/baas-main;Hash=c68c5aa61293af7317ce95a81111deb355d7f6acdfabeb775e95a468d14f947a;Subject=\"O=MongoDB\\, Inc.,CN=lb-b\";URI=spiffe://xgen-prod/ns/vm-prod/sa/lb-b"
                ]
            },
            "body": {
                "Subtype": 0,
                "Data": "ewogICAgImxvZ2luIjogImphcmRlbDAxMDEiLAogICAgImVuY3J5cHRlZFBhc3N3b3JkIjogIllUbGhZV0ZpWVdOaFpHRmxZV1poTUE9PSIKfQ=="
            }
        }

  let parameters
  let loggedUser
  const data = payload.body
  const remoteIp = payload.headers['X-Cluster-Client-Ip'][0]

  // await loadDeviceTypes()

  if (!data) {
    throw new Error('É necessário fornecer informações válidas para autenticação! D:', data)
  }

  try {
    parameters = JSON.parse(data.text())
  } catch (e) {
    throw new Error('É necessário fornecer informações válidas para autenticação! E: ', e)
  }

  if (parameters.login == null || parameters.encryptedPassword == null) {
    throw new Error('É necessário fornecer informações válidas para autenticação! P: ', parameters)
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
  
  console.log("DTypes: ", deviceTypes)
  deviceTypes.forEach(element => {
    console.log("Verificando tipo: ", element.SiglaConfRadio)
    // for(let i = 0; i < dbDeviceTypes.length; i++) {
    //   if(dbDeviceTypes[i].SiglaConfRadio === element.SiglaConfRadio) {
    //     console.log('Inserindo tipo de dispositivo: ', element.SiglaConfRadio)
    //     deviceTypesToInsert.push(element)
    //   }
    // }
    
    // if (dbDeviceTypes.some(type => type.hasOwnProperty(element.SiglaConfRadio))) {
    //   console.log('Inserindo tipo de dispositivo: ', element.SiglaConfRadio)
    //   deviceTypesToInsert.push(element)
      
    // }
  })

  // databaseParameters = {
  //   action: 'insertMany',
  //   collection: 'deviceTypes',
  //   filter: { },
  //   query: { deviceTypesToInsert },
  //   options: { upsert: false }
  // }

  // try {
  //   await context.functions.execute('databaseControl', databaseParameters)
  // } catch (error) {
  //   throw new Error(`Ocorreu um erro ao inserir os Tipos de Dispositivo! ${error}`)
  // }
}

if (typeof module === 'object') {
  module.exports = exports
}
