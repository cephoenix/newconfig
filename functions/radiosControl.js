/* eslint-disable no-undef */
// eslint-disable-next-line n/no-exports-assign
exports = async function (payload) {
  const databaseCollection = 'radios'
  let databaseAction
  let databaseFilter
  let processedRequestData

  /**
    * Processa a requisição: Decodifica os dados e depois tranforma em formato JSON
    */
  try {
    processedRequestData = await context.functions.execute('proccessRequest', payload)
  } catch (error) {
    return { success: false, data: error }
  }

  // processedRequestData = {
  //   headers: {
  //     Accept: [
  //       '*/*'
  //     ],
  //     'Postman-Token': [
  //       '6a9b9513-8152-41d3-a0d4-b84227a09a4b'
  //     ],
  //     'Content-Length': [
  //       '287'
  //     ],
  //     'X-Forwarded-For': [
  //       '200.181.33.155'
  //     ],
  //     'X-Forwarded-Proto': [
  //       'https'
  //     ],
  //     'X-Envoy-External-Address': [
  //       '200.181.33.155'
  //     ],
  //     'X-Cluster-Client-Ip': [
  //       '200.181.33.155'
  //     ],
  //     'Content-Type': [
  //       'application/json'
  //     ],
  //     'Accept-Encoding': [
  //       'gzip, deflate, br'
  //     ],
  //     'X-Request-Id': [
  //       '98cb09e3-4085-44c3-bb03-cd87bbc4dab0'
  //     ],
  //     'X-Forwarded-Client-Cert': [
  //       'By=spiffe://xgen-prod/ns/baas-prod/sa/baas-main;Hash=c68c5aa61293af7317ce95a81111deb355d7f6acdfabeb775e95a468d14f947a;Subject="O=MongoDB, Inc.,CN=lb-b";URI=spiffe://xgen-prod/ns/vm-prod/sa/lb-b'
  //     ],
  //     'User-Agent': [
  //       'PostmanRuntime/7.32.3'
  //     ]
  //   },
  //   // urlParameters: {
  //   //   action: 'changeClient'
  //   // },
  //   // body: {
  //   //   mac: '84BA20FFFE969EE5',
  //   //   clientId: '64a32a076c2f09966db40bd7',
  //   //   name: 'JJJ_LRRIF0001',
  //   //   hardwareVersion: '2021-01-01 0',
  //   //   firmwareVersion: '2023-06-02 1',
  //   //   ProfileId: '',
  //   //   manufacturerId: '',
  //   //   userId: '64a32a076c2f09966db40be7'
  //   // }
  //   urlParameters: {
  //     action: 'getNewNumber'
  //   },
  //   body: {
  //     mac: '84BA20FFFE969EE5',
  //     clientId: '64a32a076c2f09966db40bdb',
  //     deviceName: 'JJJ_LRPFH0001'
  //   }
  // }

  /**
   * mac: 84BA20FFFE968684
   * clientId: 64a3147b6c2f09966dabb9d8
   * deviceName: JJJ_LRRIF0001
   *
   * mac: 84BA20FFFE968673
   * clientId: 64a3147b6c2f09966dabb9d8
   * deviceName: JJJ_LRRIF0001
   */

  // 84BA20FFFE968684
  // 84BA20FFFE968673

  const action = processedRequestData.urlParameters.action
  const databaseQuery = processedRequestData.body
  /**
   * Ao atualizar um rádio a resposta vai ser o cliente desse rádio com o resumo de dispositivos atualizado
   */
  try {
    await context.functions.execute('radiosValidation', processedRequestData)
  } catch (error) {
    return { success: false, data: error }
  }

  /**
   * Executa algum tratamento antes, se necessário, e depois faz a operação com o Banco de Dados
   */

  switch (action) {
    case 'create':
      databaseAction = 'insertOne'
      break

    case 'findOne':
      databaseAction = 'findOne'
      break

    case 'findAll':
      databaseAction = 'find'
      operationParameters = {}
      break

    case 'findMany':
      databaseAction = 'find'
      // if (payload.body == null) {
      //   throw new Error('É necessário fornecer informações válidas para pesquisar no Banco de Dados!')
      // }

      // try {
      //   operationParameters = JSON.parse(payload.body.text())
      // } catch (e) {
      //   throw new Error('É necessário fornecer informações válidas (array) para pesquisar no Banco de Dados!')
      // }
      break

    case 'updateOne':
      operationName = 'databaseUpdateOne'
      break

    case 'excludeOne':
      operationName = 'databaseExcludeOne'
      break

    case 'deleteOne':
      operationName = 'databaseDeleteOne'
      break

    case 'insertMany':

      if (payload.body == null) {
        throw new Error('É necessário fornecer informações válidas para inserir no Banco de Dados!')
      }

      try {
        operationParameters = JSON.parse(payload.body.text())
      } catch (e) {
        throw new Error('É necessário fornecer informações válidas para inserir no Banco de Dados!')
      }
      operationName = 'radiosInsertMany'
      break

    case 'getNewNumber':
      try {
        return { success: true, data: await getRadioNumber(processedRequestData.body) }
      } catch (error) {
        return { success: false, data: `Erro ao obter numeração do dispositivo: ${error}` }
      }

    case 'changeClient':
      try {
        await changeClient(processedRequestData.body)
      } catch (error) {
        return { success: false, data: `Erro ao confirmar alteração da rede do dispositivo: ${error}` }
      }
      return { success: true, data: 'A rede do dispositivo foi alterada com sucesso!' }

    default:
      return { success: false, data: 'Ação inválida!' }
  }

  try {
    const databaseParameters = {
      action: databaseAction,
      collection: databaseCollection,
      query: databaseQuery,
      filter: databaseFilter
    }

    return {
      success: true,
      data: await context.functions.execute('databaseControl', databaseParameters)
    }
  } catch (error) {
    return { success: false, data: error }
  }
}

/**
 * @param {*} requestData
 * @returns
 */
async function getRadioNumber (requestData) {
  const deviceType = requestData.deviceName.substring(4, 9)
  const ret = {}
  ret.type = deviceType

  /**
   * Retrieving Device information
   */
  let databaseParameters = {
    action: 'findOne',
    collection: 'radios',
    query: { address64Bit: requestData.mac }
  }

  const device = await context.functions.execute('databaseControl', databaseParameters)

  /**
   * Retrieving Client information
   */
  databaseParameters = {
    action: 'findOne',
    collection: 'clients',
    query: { _id: requestData.clientId }
  }

  const client = await context.functions.execute('databaseControl', databaseParameters)

  if (client == null) {
    throw new Error('Não foi possível encontrar o cliente informado')
  }

  /**
   * Proccessing information
   * We need to check if there is any device of this type on this client network and return next number
   */
  let definitiveNumber
  if (device != null && device !== '') { // In this case, device already exists
    ret.rewrite = true
    ret.overwrite = (device.deviceTypeInitials !== deviceType)

    if (device.clientOID === client._id) { // Device exists and its beeing changed to the same network we get the same number this device has at thie moment
      definitiveNumber = +requestData.deviceName.substring(9, 13)
      // At this point definitive number should be the same as the one inside radio.clientSummary['<clientName>'] @todo checktit?
      // In fact this device should not need a network change....
    } else { // Device exists and its beeing changed to another network. We get a new number accordingly to client's summary (inside device object)
      if (client.deviceTypeSummary != null && client.deviceTypeSummary !== '') { // if client summary is not null, we use it to get device number
        if (device.clientSummary != null && device.clientSummary !== '') {
          lastDeviceNumberForThisClient = device.clientSummary[`${client.initials}`]
          if (lastDeviceNumberForThisClient != null && lastDeviceNumberForThisClient !== '') { // If we find a number for this device in clientSummary (Inside device object), we return it
            definitiveNumber = lastDeviceNumberForThisClient
          } else { // Otherwise this radio had never been on this client network and we should get next number (based on last device of this network)
            const lastNumberForThisDeviceType = +client.deviceTypeSummary[`${deviceType}`]
            if (lastNumberForThisDeviceType != null && lastNumberForThisDeviceType !== undefined && lastNumberForThisDeviceType !== '') { // If we find a log entry on deviceSmmary for this 'device type' we add 1 and return the new device number
              definitiveNumber = lastNumberForThisDeviceType + 1
            } else { // If we dont find any log entry on deviceTypeSummary for this 'device type' we start from the beginning
              definitiveNumber = 1
            }
          }
        } else { // client.deviceTypeSummary is empty. device.clientSummay should also be empty for this device
          if (device.clientSummary != null && device.clientSummary !== '' && device.clientSummary[`${client.initials}`] != null && device.clientSummary[`${client.initials}`] !== '') {
            throw new Error('Favor verificar a consistência dos dados entre a Collection de Dispositivos e a Collection do Cliente. Suspeita de numeração inconsistente!')
          }
          definitiveNumber = 1
        }
      } else { // If client.deviceSummay is null we start from the beggining. But... even if device.clientSummary is empty? (this should never happen)
        if (device.clientSummary != null && device.clientSummary !== '') { // If device.clientSummary is null everything is OK, but if it's NOT NULL we need to check if we have any entry for this client in deviceSummary
          if (device.clientSummary[`${client.initials}`] != null && device.clientSummary[`${client.initials}`] !== '') {
            throw new Error('Favor verificar a consistência dos dados entre a Collection de Dispositivos e a Collection do Cliente. Suspeita de numeração inconsistente!')
          }
        }
        definitiveNumber = 1
      }
    }
  } else { // In this case, device network was never changed
    ret.rewrite = false
    ret.overwrite = false

    // Client is never null at this point, because we checked it before. Then we only check deviceTypeSummary
    if (client.deviceTypeSummary != null && client.deviceTypeSummary !== '') {
      const lastNumberForThisDeviceType = +client.deviceTypeSummary[`${deviceType}`]
      if (lastNumberForThisDeviceType != null && lastNumberForThisDeviceType !== '') {
        definitiveNumber = lastNumberForThisDeviceType + 1
      } else {
        definitiveNumber = 1
      }
    } else {
      definitiveNumber = 1
    }
  }
  ret.name = `${client.initials}_${deviceType}${String(definitiveNumber).padStart(4, '0')}` // Sets device name based on definitive number we got
  return ret
}

/**
 * updates database with information about changes on a device network
 * @param {*} requestData
 * {
 *  mac: <address64Bit>
 *  clientId: <oid>
 *  deviceName: <String>
 * }
 * Campos obrigatórios:
 * - mac
 * - name
 * - firmwareVersion
 * - hardwareVersion
 */
async function changeClient (requestData) {
  let client
  let device
  let deviceType
  let deviceToInsert
  let deviceNumber
  const profileId = requestData.firmwareVersion.substring(0, 2)
  const manufacturerId = requestData.firmwareVersion.substring(3, 6)

  /**
   * Retrieving Device information
   */
  let databaseParameters = {
    action: 'findOne',
    collection: 'radios',
    query: { address64Bit: requestData.mac }
  }

  try {
    device = await context.functions.execute('databaseControl', databaseParameters)
  } catch (error) {
    return { success: false, data: `Erro ao buscar dispositivo. ${error}` }
  }

  /**
   * Retrieving Client information
   */
  databaseParameters = {
    action: 'findOne',
    collection: 'clients',
    query: { _id: requestData.clientId }
  }

  try {
    client = await context.functions.execute('databaseControl', databaseParameters)
  } catch (error) {
    throw new Error(`Erro ao buscar cliente. ${error}`)
  }

  if (client === undefined) {
    throw new Error('Cliente não encontrado!')
  }

  try {
    deviceType = await getDeviceTypeByName(requestData.name)
  } catch (e) {
    throw new Error('Error ao bucar o tipo do dispositivo!')
  }

  try {
    deviceNumber = +requestData.name.substring(9, 13)
    deviceToInsert = {
      name: `${requestData.name}`,
      number: deviceNumber,
      firmwareVersion: `${requestData.firmwareVersion}`,
      hardwareVersion: `${requestData.hardwareVersion}`,
      profileId: `${profileId}`,
      manufacturerId: `${manufacturerId}`,
      group: `${(requestData.name).substring(4, 9)}`, // I'm using the same as the device Initials
      deviceTypeId: `${deviceType._id}`,
      deviceTypeInitials: `${deviceType.initials}`,
      deviceTypeName: `${deviceType.exhibitionName}`,
      deviceTypeDescription: `${deviceType.description}`,
      deviceClass: `${deviceType.class}`,
      productCode: `${deviceType.productCode}`,
      clientOID: `${client._id}`,
      clientName: `${client.name}`,
      clientInitials: `${client.initials}`,
      clientChannel: client.channel,
      clientType: {
        type: client.clientType.type,
        name: `${client.clientType.name}`
      },
      recordingDate: new Date()
    }

    if (device.clientSummary[`${client.initials}`] != null && device.clientSummary[`${client.initials}`] !== '') { // If device had been changed to this network once, we check if its number is the same as before
      const number = +device.clientSummary[`${client.initials}`]
      if (number !== deviceNumber) {
        throw new Error(`Numeração inconsistente! Esse dispositivo já foi gravado para esse cliente com a seguinte numeração: ${number}`)
      }
    } else { // If device had never been on this Client we insert a new entry for this Client
      deviceToInsert.clientSummary[`${client.initials}`] = deviceNumber
    }
  } catch (e) {
    throw new Error(`Houve um problema com os dados do dispositivo a ser atualizado! ${e}`)
  }
  /**
   * UPSERT DEVICE
   */

  databaseParameters = {
    action: 'updateOne',
    collection: 'radios',
    filter: { address64Bit: requestData.mac },
    query: { $set: deviceToInsert },
    options: { upsert: true }
  }

  try {
    await context.functions.execute('databaseControl', databaseParameters)
  } catch (error) {
    throw new Error(`Ocorreu um erro ao atualizar o dispositivo! ${error}`)
  }

  /**
   * UPDATE CLIENT
   */
  try {
    const filter = { _id: new BSON.ObjectId(`${client._id}`) }

    if (client.deviceTypeSummary != null && client.deviceTypeSummary !== '') {
      // Check if this device is been rewritten
      if (!requestData.rewrite) { // If device was rewritten we dont update client.deviceTypeSummary. In case device was not rewritten it got the following number on this client sequence, then we update it
        client.deviceTypeSummary[`${deviceType.initials}`] = deviceNumber
      }
    } else {
      client.deviceTypeSummary = {}
      client.deviceTypeSummary[`${deviceType.initials}`] = deviceNumber
    }

    await context.services.get('mongodb-atlas').db('configRadio').collection('clients').updateOne(
      filter,
      { $set: client }
    )
  } catch (error) {
    throw new Error(`Ocorreu um erro ao atualizar o cliente! ${error}`)
  }
}

/**
 * @returns
 */
async function getDeviceTypeByName (n) {
  const initials = n.substring(4, 9)
  let deviceTypes
  let typeToReturn

  try {
    deviceTypes = await context.services.get('mongodb-atlas').db('configRadio').collection('deviceTypes').find({ initials: `${initials}` })
    deviceTypes = await deviceTypes.toArray()
  } catch (e) {
    throw new Error(`Ocorreu um problema ao buscar os tipos de dispositivo ${e}`)
  }

  try {
    deviceTypes.forEach(type => {
      if (type.initials === initials) {
        typeToReturn = type
      }
    })
  } catch (e) {
    throw new Error(`Não foi possível buscar a lista de Tipos de Dispositivo. ${e}`)
  }

  if (typeToReturn == null) {
    /**
    * Quando não encontramos o dispositivo cadastrado, tentamos fazer uma busca na API do Buble
    */
    const response = await context.http.get({
      url: 'https://app.firebee.com.br/api/1.1/obj/Products/',
      requestHeaders: {
        'Content-Type': ['application/json'],
        Authorization: 'Bearer 0b6336226cbe51d8b47e2f04b70de602'
      },
      body: {},
      encodeBodyAsJSON: true
    })

    const rawData = await JSON.parse(response.body.text()).response.results

    // Tentando buscar o tipo de dispositivo nos resultados encontrados
    const resp = []
    rawData.forEach(element => {
      if (element.SiglaConfRadio.includes('LR')) {
        let x = `${element.SiglaConfRadio}`
        const y = element.DescriptionPTBR

        if (y !== undefined && y != null && y !== '') {
          x += ` - ${y.slice(0, 13)}`
        }

        if (element.SiglaConfRadio === initials) {
          resp.push({
            productCode: element.Codigo,
            initials: element.SiglaConfRadio,
            exhibitionName: x,
            class: element.DeviceClass,
            description: element.Nome
          })
        }
      }
    })

    // Se encontramos o tipo de dispositivo no Bubble inserimos ele no Banco de dados local e retornamos
    if (resp.length > 0) {
      try {
        await context.services.get('mongodb-atlas').db('configRadio').collection('deviceTypes').insertMany(resp)
      } catch (e) {
        throw new Error(`Erro ao inserir Tipo de Dispositivo (${initials}) que não estava cadastrado! ${e}`)
      }
      return resp[0]
    } else {
      console.log('NOT FOUND')
      throw new Error(`Tipo de dispositivo (${initials}) não encontrado! `)
    }
  } else {
    return typeToReturn
  }
}

if (typeof module === 'object') {
  module.exports = exports
}
