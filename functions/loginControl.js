/* eslint-disable no-undef */
// eslint-disable-next-line n/no-exports-assign
exports = async function (payload) {

  let action
  let operationName
  let operationResponse
  let operationParameters

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
  if(payload === 'Hello world!') {
    action = 'testLogin'
  }
    
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
      if(payload === 'Hello world!') {
        processedRequestData = {
          "headers": {
              "User-Agent": [
                  "PostmanRuntime/7.32.3"
              ],
              "Accept": [
                  "*/*"
              ],
              "Accept-Encoding": [
                  "gzip, deflate, br"
              ],
              "X-Forwarded-Proto": [
                  "https"
              ],
              "Authorizationkey": [
                  "645e4f0a833b23298defbed9"
              ],
              "Postman-Token": [
                  "09bef8dc-26ba-4d29-9a62-a01e9033fd5c"
              ],
              "Content-Length": [
                  "82"
              ],
              "X-Request-Id": [
                  "079051cd-4615-4ad8-80ee-ec6e28453b2b"
              ],
              "X-Envoy-External-Address": [
                  "179.73.185.92"
              ],
              "X-Cluster-Client-Ip": [
                  "179.73.185.92"
              ],
              "Content-Type": [
                  "application/json"
              ],
              "X-Forwarded-For": [
                  "179.73.185.92"
              ],
              "X-Forwarded-Client-Cert": [
                  "By=spiffe://xgen-prod/ns/baas-prod/sa/baas-main;Hash=c68c5aa61293af7317ce95a81111deb355d7f6acdfabeb775e95a468d14f947a;Subject=\"O=MongoDB\\, Inc.,CN=lb-b\";URI=spiffe://xgen-prod/ns/vm-prod/sa/lb-b"
              ]
          },
          "urlParameters": {
              "action": "testLogin"
          },
          "body": {
              "login": "jardel0101",
              "encryptedPassword": "YTlhYWFiYWNhZGFlYWZhMA=="
          }
        }
      } else {
        try {
          processedRequestData = await context.functions.execute('proccessRequest', payload)
        } catch (error) {
          return { success: false, data: error }
        }        
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

  try {
    await dd("Entrando na função loadDeviceTypesFromBubble")
    await loadDeviceTypesFromBubble()
  } catch (error) {
    await dd("Deu pau no loadDeviceTypesFromBubble")
    return { success: false, data: error }
  }

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

async function dd(msg) {
  await console.log(msg)
}

/**
 * Load device types from Bubble API
 */
async function loadDeviceTypesFromBubble () {

  await dd('Ponto1')

  databaseParameters = {
    action: 'findMany',
    collection: 'deviceTypes',
    filter: {},
    query: {},
    options: {}
  }
  await dd('Ponto2')
  let dbDeviceTypes
  try {
    dbDeviceTypes = await context.functions.execute('databaseControl', databaseParameters)
  } catch (error) {
    throw new Error(`Ocorreu um erro ao buscar os Tipos de Dispositivo! ${error}`)
  }
  await dd('Ponto3')
console.log("Resp: ", await JSON.stringify(dbDeviceTypes))
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

//   // Tentando buscar o tipo de dispositivo nos resultados encontrados
//   const deviceTypesToInsert = []


//   deviceTypes.forEach(element => {
//     console.log("Ponto 2. Sigla: ", element.SiglaConfRadio, "Código: ", element.Codigo)
//     console.log("DB DEvices: ", JSON.stringify(dbDeviceTypes))
//     let isToInsert = true
//     for (let index = 0; index < dbDeviceTypes.length; index++) {
      
//       console.log('Device do Bubble: ', element)
//       console.log('Device do Banco: ', dbDeviceTypes[index])
//       if (dbDeviceTypes[index].SiglaConfRadio === element.SiglaConfRadio) {
//         isToInsert = false
//       }
//     }
//     if (isToInsert) {
//       deviceTypesToInsert.push(element)
//     }
//     isToInsert = true
//   })

//   databaseParameters = {
//     action: 'insertMany',
//     collection: 'deviceTypes',
//     filter: { },
//     query: { deviceTypesToInsert },
//     options: { upsert: false }
//   }

//   try {
//     await context.functions.execute('databaseControl', databaseParameters)
//   } catch (error) {
//     throw new Error(`Ocorreu um erro ao inserir os Tipos de Dispositivo! ${error}`)
//   }
}

if (typeof module === 'object') {
  module.exports = exports
}
