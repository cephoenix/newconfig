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

  if(payload === 'Hello world!') {
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
return {debug: payload}
      try {
        processedRequestData = await context.functions.execute('proccessRequest', payload)
      } catch (error) {
        return { success: false, data: error }
      }
return {debug: processedRequestData}
      /**
       * Ao atualizar um rádio a resposta vai ser o cliente desse rádio com o resumo de dispositivos atualizado
       */
      try {
        await context.functions.execute('loginValidation', processedRequestData)
      } catch (error) {
        return { success: false, data: error }
      }

      try {
        return { success: true, data: await doLoginTest(processedRequestData) }
      } catch (error) {
        return { success: false, data: error }
      }

    default:
      return { success: false, data: 'Ação inválida!' }
  }
}

async function doLoginTest () {
  
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
  devicesFromAPI.forEach(element => {
    if (element.SiglaConfRadio.includes('LR')) {
      console.log("IS IN ARRAY: ", isDeviceTypeInArray(element.SiglaConfRadio, deviceTypesFromDatabase))
      if (!isDeviceTypeInArray(element.SiglaConfRadio, deviceTypesFromDatabase)) {
        const temp = element
        delete temp._id
        // deviceTypesToInsert.push(temp)
      }
    }
  })

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

function isDeviceTypeInArray (initials, arrayToCheck) {
  for (let index = 0; index < arrayToCheck.length; index++) {
    if (arrayToCheck[index].initials === initials) {
      return true
    }
  }
  return false
}

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
