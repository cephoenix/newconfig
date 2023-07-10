/* eslint-disable no-undef */
// eslint-disable-next-line n/no-exports-assign
exports = async function (payload) {
  let action

  try {
    //  id, action, page etc should be on url parameters. These parameters are contained inside payload.query
    action = payload.query.action
  } catch (err) {
    action = payload.action
  }

  if (payload === 'Hello world!') {
    action = 'testLogin'
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
        return { success: true, data: await doLogin(processedRequestData) }
      } catch (error) {
        return { success: false, data: error }
      }

    case 'testLogin':

      try {
        processedRequestData = await context.functions.execute('proccessRequest', payload)
      } catch (error) {
        return { success: false, data: error }
      }

      if (payload === 'Hello world!') {
        processedRequestData = {
          headers: {
            'X-Envoy-External-Address': [
              '179.73.185.92'
            ],
            'X-Request-Id': [
              '4285d885-40e4-466f-96f0-61bf226fd7e2'
            ],
            'X-Forwarded-Proto': [
              'https'
            ],
            'X-Forwarded-For': [
              '179.73.185.92'
            ],
            Authorizationkey: [
              '645e4f0a833b23298defbed9'
            ],
            'Content-Type': [
              'application/json'
            ],
            'User-Agent': [
              'PostmanRuntime/7.32.3'
            ],
            'Postman-Token': [
              '3b70b0ed-7f8d-40c9-95cf-e06f2381b106'
            ],
            'Accept-Encoding': [
              'gzip, deflate, br'
            ],
            'Content-Length': [
              '82'
            ],
            Accept: [
              '*/*'
            ],
            'X-Forwarded-Client-Cert': [
              'By=spiffe://xgen-prod/ns/baas-prod/sa/baas-main;Hash=c68c5aa61293af7317ce95a81111deb355d7f6acdfabeb775e95a468d14f947a;Subject="O=MongoDB\\, Inc.,CN=lb-b";URI=spiffe://xgen-prod/ns/vm-prod/sa/lb-b'
            ],
            'X-Cluster-Client-Ip': [
              '179.73.185.92'
            ]
          },
          urlParameters: {
            action: 'testLogin'
          },
          body: {
            login: 'jardel0101',
            encryptedPassword: 'YTlhYWFiYWNhZGFlYWZhMA=='
          }
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
        
        let resp = await doLoginTest(processedRequestData)
        console.log("AUTH: ", JSON.stringify(context.authorization))
        console.log("USER: ", JSON.stringify(context.user))
        return { success: true, data: resp }
      } catch (error) {
        return { success: false, data: error }
      }

    default:
      return { success: false, data: 'Ação inválida!' }
  }
}

async function doLoginTest (parameters) {
  const data = parameters.body
  const remoteIp = parameters.headers['X-Cluster-Client-Ip'][0]

  /**
   * Retrieving User information
   */
  let databaseParameters = {
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
    // await dbquery.insertOne({ login: parameters.login, success: false, clientIp: remoteIp, date: new Date(), reason: 'Senha incorreta' })

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
    await updateDeviceTypesList()
  } catch (error) {
    return { success: false, data: error }
  }

  databaseParameters = {
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

async function doLogin (parameters) {
  const data = parameters.body
  const remoteIp = parameters.headers['X-Cluster-Client-Ip'][0]

  /**
   * Retrieving User information
   */
  let databaseParameters = {
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
    // await dbquery.insertOne({ login: parameters.login, success: false, clientIp: remoteIp, date: new Date(), reason: 'Senha incorreta' })

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

  // try {
  //   await updateDeviceTypesList()
  // } catch (error) {
  //   return { success: false, data: error }
  // }

  databaseParameters = {
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

async function updateDeviceTypesList () {
  const deviceTypesFromDatabase = await getDeviceTypesListFromDatabase()
  const devicesFromAPI = await getDeviceTypesListFromAPI()

  const deviceTypesToInsert = []
  await devicesFromAPI.forEach(async element => {
    if (element.SiglaConfRadio.includes('LR')) {
      let isToInsert = true
      for (let index = 0; index < deviceTypesFromDatabase.length; index++) {
        if (deviceTypesFromDatabase[index].initials === element.SiglaConfRadio) {
          isToInsert = false
        }
      }
      if (isToInsert) {
        let x = `${element.SiglaConfRadio}`
        const y = element.DescriptionPTBR
        // eslint-disable-next-line eqeqeq
        if (y != null) {
          x += ` - ${y.slice(0, 13)}`
        }

        deviceTypesToInsert.push({
          productCode: element.Codigo,
          initials: element.SiglaConfRadio,
          exhibitionName: x,
          class: element.DeviceClass,
          description: element.Nome
        })
      } else {
        isToInsert = true
      }
    }
  })

  if (deviceTypesToInsert.length > 0) {
    databaseParameters = {
      action: 'insertMany',
      collection: 'deviceTypes',
      filter: {},
      query: deviceTypesToInsert,
      options: { upsert: false }
    }

    try {
      await context.functions.execute('databaseControl', databaseParameters)
    } catch (error) {
      throw new Error(`Ocorreu um erro ao inserir os Tipos de Dispositivo! ${error}`)
    }
  }
}

// function isDeviceTypeInArray (initials, arrayToCheck) {
//   for (let index = 0; index < arrayToCheck.length; index++) {
//     console.log('1: ', arrayToCheck[index].initials, '2: ', initials)
//     if (arrayToCheck[index].initials === initials) {
//       return true
//     }
//   }
//   // console.log(initials, " Não está no array")
//   // console.log("Array sigla: ", arrayToCheck.length, JSON.stringify(arrayToCheck[25]))
//   // console.log("Initials: ", initials)
//   // console.log("Condition: ", arrayToCheck[25].initials === initials)
//   return false
// }

async function getDeviceTypesListFromDatabase () {
  databaseParameters = {
    action: 'findMany',
    collection: 'deviceTypes',
    filter: {},
    query: {},
    options: {}
  }
  try {
    return await context.functions.execute('databaseControl', databaseParameters)
  } catch (error) {
    throw new Error(`Ocorreu um erro ao buscar os Tipos de Dispositivo! ${error}`)
  }
}

async function getDeviceTypesListFromAPI () {
  const requestResponse = await context.http.get({
    url: 'https://app.firebee.com.br/api/1.1/obj/Products/',
    requestHeaders: {
      'Content-Type': ['application/json'],
      Authorization: 'Bearer 0b6336226cbe51d8b47e2f04b70de602'
    },
    body: {},
    encodeBodyAsJSON: true
  })
  return await JSON.parse(requestResponse.body.text()).response.results
}

if (typeof module === 'object') {
  module.exports = exports
}
