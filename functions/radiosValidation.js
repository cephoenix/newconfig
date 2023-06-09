/* eslint-disable no-undef */
// eslint-disable-next-line n/no-exports-assign
exports = async function (data) {
  const action = data.urlParameters.action
  const parameters = data.body

  switch (action) {
    case 'create':
      await validateCreate(parameters)
      break

    case 'findOne':
      await validateFindOne(parameters)
      break

    case 'findAll':
      await validateFindAll(parameters)
      break

    case 'findMany':
      await validateFindMany(parameters)
      break

    case 'updateOne':
      await validateUpdateOne(parameters)
      break

    case 'excludeOne':
      await validateExcludeOne(parameters)
      break

    case 'deleteOne':
      await validateDeleteOne(parameters)
      break

    case 'getDevicesByClientId':
      await validateGetDevicesByClientId(parameters)
      break

    case 'getNewNumber':
      await validateGetNewNumber(parameters)
      break

    case 'changeClient':
      await validateChangeClient(parameters)
      break

    default:
      if (action == null || action === undefined || action === '') {
        throw new Error('Nenhuma ação informada!')
      } else {
        throw new Error(`Ação (${action}) inválida!`)
      }
  }
}

async function validateCreate (parameters) {
  if (parameters.address64Bit === undefined || parameters.address64Bit == null || parameters.address64Bit === '') {
    throw new Error('É necessário informar o Endereço 64 bits (MAC) do Rádio!')
  }

  query = { address64Bit: parameters.address64Bit }

  try {
    dbResponse = await context.functions.execute('databaseFindOne', { query: JSON.stringify(query), collection: 'radios' })
  } catch (e) {
    throw new Error(`Erro ao buscar Rádio: ${e}`)
  }

  if (dbResponse !== undefined && dbResponse !== '' && dbResponse != null && dbResponse !== {}) {
    throw new Error('Esse Rádio já existe!')
  }
}

async function validateFindOne (parameters) {

}

async function validateFindAll (parameters) {

}

async function validateFindMany (parameters) {

}

async function validateUpdateOne (parameters) {
  if (parameters.address64Bit === undefined || parameters.address64Bit == null || parameters.address64Bit === '') {
    throw new Error('É necessário informar o Endereço 64 bits (MAC) do Rádio!')
  }

  query = { address64Bit: parameters.address64Bit }

  try {
    dbResponse = await context.functions.execute('databaseFindOne', { query: JSON.stringify(query), collection: 'radios' })
  } catch (e) {
    throw new Error(`Erro ao buscar Rádio: ${e}`)
  }

  if (dbResponse !== undefined && dbResponse !== '' && dbResponse != null && dbResponse !== {}) {
    throw new Error('Esse Rádio já existe!')
  }
}

async function validateExcludeOne (parameters) {
  if (parameters._id === '' || parameters._id === undefined || parameters._id == null) {
    throw new Error('O campo "_id" é obrigatório!')
  }
}

async function validateDeleteOne (parameters) {
  if (parameters._id === '' || parameters._id === undefined || parameters._id == null) {
    throw new Error('O campo "_id" é obrigatório!')
  }
}

async function validateGetNewNumber (parameters) {
  if (parameters.mac === '' || parameters.mac === undefined || parameters.mac == null) {
    throw new Error('O campo "mac" é obrigatório!')
  }

  if (parameters.clientId === '' || parameters.clientId === undefined || parameters.clientId == null) {
    throw new Error('O campo "clientId" é obrigatório!')
  }
}

async function validateGetDevicesByClientId (parameters) {
  if (parameters.clientId === '' || parameters.clientId === undefined || parameters.clientId == null) {
    throw new Error('O campo "clientId" é obrigatório!')
  }
}

async function validateChangeClient (parameters) {
  if (parameters.mac === '' || parameters.mac === undefined || parameters.mac == null) {
    throw new Error('O campo "mac" é obrigatório!')
  }

  if (parameters.clientId === '' || parameters.clientId === undefined || parameters.clientId == null) {
    throw new Error('O campo "clientId" é obrigatório!')
  }

  if (parameters.firmwareVersion === '' || parameters.firmwareVersion === undefined || parameters.firmwareVersion == null) {
    throw new Error('O campo "firmwareVersion" é obrigatório!')
  }

  if (parameters.hardwareVersion === '' || parameters.hardwareVersion === undefined || parameters.hardwareVersion == null) {
    throw new Error('O campo "hardwareVersion" é obrigatório!')
  }
}

if (typeof module === 'object') {
  module.exports = exports
}
