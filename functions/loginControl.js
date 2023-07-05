/* eslint-disable no-undef */
// eslint-disable-next-line n/no-exports-assign
exports = async function (payload) {
  
  let action
  let operationName
  let operationResponse
  let operationParameters

  // if(payload === 'Hello world!') {

  //   payload = {
  //     "query": {
  //         "action": "testLogin"
  //     },
  //     "headers": {
  //         "User-Agent": [
  //             "PostmanRuntime/7.32.3"
  //         ],
  //         "X-Forwarded-For": [
  //             "179.73.185.92"
  //         ],
  //         "X-Envoy-External-Address": [
  //             "179.73.185.92"
  //         ],
  //         "Content-Type": [
  //             "application/json"
  //         ],
  //         "Content-Length": [
  //             "82"
  //         ],
  //         "X-Forwarded-Proto": [
  //             "https"
  //         ],
  //         "X-Request-Id": [
  //             "94bce265-bc36-44d4-b3d1-9575f43988a2"
  //         ],
  //         "X-Forwarded-Client-Cert": [
  //             "By=spiffe://xgen-prod/ns/baas-prod/sa/baas-main;Hash=c68c5aa61293af7317ce95a81111deb355d7f6acdfabeb775e95a468d14f947a;Subject=\"O=MongoDB\\, Inc.,CN=lb-b\";URI=spiffe://xgen-prod/ns/vm-prod/sa/lb-b"
  //         ],
  //         "X-Cluster-Client-Ip": [
  //             "179.73.185.92"
  //         ],
  //         "Accept": [
  //             "*/*"
  //         ],
  //         "Postman-Token": [
  //             "6899a606-b081-4876-9509-bbb341c2ac4b"
  //         ],
  //         "Accept-Encoding": [
  //             "gzip, deflate, br"
  //         ],
  //         "Authorizationkey": [
  //             "645e4f0a833b23298defbed9"
  //         ]
  //     },
  //     "body": {
  //         "Subtype": 0,
  //         "Data": "ewogICAgImxvZ2luIjogImphcmRlbDAxMDEiLAogICAgImVuY3J5cHRlZFBhc3N3b3JkIjogIllUbGhZV0ZpWVdOaFpHRmxZV1poTUE9PSIKfQ=="
  //     }
  //   }    
  // }
  
  try {
    //  id, action, page etc should be on url parameters. These parameters are contained inside payload.query
    action = payload.query.action
  } catch (err) {
    action = payload.action
  }

  /**
   * Se tiver alguma verificação geral, que deve ser feita para todas as ações, ela deve ser feita aqui
   * Verificações específicas são feitas dentro de cada uma das operações
   */
  
  switch (action) {
    case 'doLogin':

      try {
        processedRequestData = await context.functions.execute('proccessRequest', payload)
      } catch (error) {
        return { success: false, data: error }
      }

      /**
       * Ao atualizar um rádio a resposta vai ser o cliente desse rádio com o resumo de dispositivos atualizado
       */
      try {
        await context.functions.execute('loginValidation', processedRequestData)
      } catch (error) {
        return { success: false, data: error }
      }

      try {
        return {success: true, data: await doLogin(processedRequestData)}
      } catch (error) {
        return { success: false, data: error }
      }
      
      break

    case 'testLogin':

      try {
        processedRequestData = await context.functions.execute('proccessRequest', payload)
      } catch (error) {
        return { success: false, data: error }
      }

      /**
       * Ao atualizar um rádio a resposta vai ser o cliente desse rádio com o resumo de dispositivos atualizado
       */
      try {
        await context.functions.execute('loginValidation', processedRequestData)
      } catch (error) {
        return { success: false, data: error }
      }

      try {
        return {success: true, data: await doLoginTest(processedRequestData)}
      } catch (error) {
        return { success: false, data: error }
      }
      
      break

    default:
      return { success: false, data: 'Ação inválida!' }
  }

  try {
    operationResponse = await context.functions.execute(operationName, operationParameters)
  } catch (e) {
    return { success: false, data: e }
  }

  return { success: true, data: operationResponse }
}

async function doLogin (parameters) {
  const data = parameters.body
  const remoteIp = parameters.headers['X-Cluster-Client-Ip'][0]

  /**
   * Retrieving User information
   */
  databaseParameters = {
    action: 'findOne',
    collection: 'users',
    query: { login: data.login }
  }

  const loggedUser = await context.functions.execute('databaseControl', databaseParameters)
  
  if (!loggedUser) {
    throw new Error('Senha ou usuário incorretos!')
  }

  const decryptedPassword = await context.functions.execute('decryptText', data.encryptedPassword) // Decriptografa a senha e depois aplica o hash nela
  const hashedPass = await context.functions.execute('encryptPassword', decryptedPassword)

  if (loggedUser.password !== hashedPass) {
    
    await dbquery.insertOne({ login: parameters.login, success: false, clientIp: remoteIp, date: new Date(), reason: 'Senha incorreta' })
    
    databaseParameters = {
      action: 'insertOne',
      collection: 'usersLoginLog',
      query: { login: parameters.login, success: false, clientIp: remoteIp, date: new Date(), reason: 'Senha incorreta' }
    }
  
    try {
      await context.functions.execute('databaseControl', databaseParameters)
    } catch (error) {
      throw new Error(`Falha ao registrar falha de login no banco de dados: ${error}`)
    }
      
    throw new Error('Senha ou usuário incorretos!')
  }
  
  if (loggedUser.blocked) {
    databaseParameters = {
      action: 'insertOne',
      collection: 'usersLoginLog',
      query: { login: parameters.login, success: false, clientIp: remoteIp, date: new Date(), reason: 'Usuário bloqueado' }
    }
  
    try {
      await context.functions.execute('databaseControl', databaseParameters)
    } catch (error) {
      throw new Error(`Falha ao registrar falha de login no banco de dados: ${error}`)
    }

    throw new Error('Usuário bloqueado!')
  }
  
  databaseParameters = {
    action: 'insertOne',
    collection: 'usersLoginLog',
    query: { login: parameters.login, success: true, clientIp: remoteIp, date: new Date() }
  }

  try {
    await context.functions.execute('databaseControl', databaseParameters)
  } catch (error) {
    throw new Error(`Falha ao registrar sucesso de login no banco de dados: ${error}`)
  }

  // await loadDeviceTypesFromBubble()

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

async function doLoginTest (parameters) {
  const data = parameters.body
  const remoteIp = parameters.headers['X-Cluster-Client-Ip'][0]

  /**
   * Retrieving User information
   */
  databaseParameters = {
    action: 'findOne',
    collection: 'users',
    query: { login: data.login }
  }

  const loggedUser = await context.functions.execute('databaseControl', databaseParameters)
  
  if (!loggedUser) {
    throw new Error('Senha ou usuário incorretos!')
  }

  const decryptedPassword = await context.functions.execute('decryptText', data.encryptedPassword) // Decriptografa a senha e depois aplica o hash nela
  const hashedPass = await context.functions.execute('encryptPassword', decryptedPassword)

  if (loggedUser.password !== hashedPass) {
    
    await dbquery.insertOne({ login: parameters.login, success: false, clientIp: remoteIp, date: new Date(), reason: 'Senha incorreta' })
    
    databaseParameters = {
      action: 'insertOne',
      collection: 'usersLoginLog',
      query: { login: parameters.login, success: false, clientIp: remoteIp, date: new Date(), reason: 'Senha incorreta' }
    }
  
    try {
      await context.functions.execute('databaseControl', databaseParameters)
    } catch (error) {
      throw new Error(`Falha ao registrar falha de login no banco de dados: ${error}`)
    }
      
    throw new Error('Senha ou usuário incorretos!')
  }
  
  if (loggedUser.blocked) {
    databaseParameters = {
      action: 'insertOne',
      collection: 'usersLoginLog',
      query: { login: parameters.login, success: false, clientIp: remoteIp, date: new Date(), reason: 'Usuário bloqueado' }
    }
  
    try {
      await context.functions.execute('databaseControl', databaseParameters)
    } catch (error) {
      throw new Error(`Falha ao registrar falha de login no banco de dados: ${error}`)
    }

    throw new Error('Usuário bloqueado!')
  }
  
  databaseParameters = {
    action: 'insertOne',
    collection: 'usersLoginLog',
    query: { login: parameters.login, success: true, clientIp: remoteIp, date: new Date() }
  }

  try {
    await context.functions.execute('databaseControl', databaseParameters)
  } catch (error) {
    throw new Error(`Falha ao registrar sucesso de login no banco de dados: ${error}`)
  }

  await loadDeviceTypesFromBubble()

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
async function loadDeviceTypesFromBubble () {
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
