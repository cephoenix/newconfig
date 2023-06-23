exports = async function (data) {

  var action = data.urlParameters.action
  var parameters = data.body

  switch (action) {
    case 'create':
      await validateCreate(parameters)
      break;

    case 'findOne':
      await validateFindOne(parameters)
      break;

    case 'findAll':
      await validateFindAll(parameters)
      break;

    case 'findMany':
      await validateFindMany(parameters)
      break;

    case 'updateOne':
      await validateUpdateOne(parameters)
      break;

    case 'excludeOne':
      await validateExcludeOne(parameters)
      break;

    case 'deleteOne':
      await validateDeleteOne(parameters)
      break;

    case 'getNewNumber':
      await validateGetNewNumber(parameters)
      break;

    case 'getNewNumber':
      await validateChangeClient(parameters)
      break;

    default:
      if (action == null || action == undefined || action == ``) {
        throw `Nenhuma ação informada!`
      } else {
        throw `Ação (${action}) inválida!`
      }
  }
};

async function validateCreate (parameters) {

  if(parameters.address64Bit == undefined || parameters.address64Bit == null || parameters.address64Bit == "") {
    throw `É necessário informar o Endereço 64 bits (MAC) do Rádio!`
  }

  query = { address64Bit:parameters.address64Bit }

  try {
    dbResponse = await context.functions.execute(`databaseFindOne`, { query: JSON.stringify(query), collection: `radios` })
  } catch (e) {
    throw `Erro ao buscar Rádio: ${e}`
  }

  if(dbResponse != undefined && dbResponse != '' && dbResponse != null && dbResponse != {}) {
    throw `Esse Rádio já existe!`
  }
}

async function validateFindOne (parameters) {

}

async function validateFindAll (parameters) {

}

async function validateFindMany (parameters) {

}

async function validateUpdateOne (parameters) {

  if(parameters.address64Bit == undefined || parameters.address64Bit == null || parameters.address64Bit == "") {
    throw `É necessário informar o Endereço 64 bits (MAC) do Rádio!`
  }

  query = { address64Bit:parameters.address64Bit }

  try {
    dbResponse = await context.functions.execute(`databaseFindOne`, { query: JSON.stringify(query), collection: `radios` })
  } catch (e) {
    throw `Erro ao buscar Rádio: ${e}`
  }

  if(dbResponse != undefined && dbResponse != '' && dbResponse != null && dbResponse != {}) {
    throw `Esse Rádio já existe!`
  }
}

async function validateExcludeOne (parameters) {

  if(parameters._id == `` || parameters._id == undefined || parameters._id == null) {
    throw `O campo "_id" é obrigatório!`
  }
}

async function validateDeleteOne (parameters) {

  if(parameters._id == `` || parameters._id == undefined || parameters._id == null) {
    throw `O campo "_id" é obrigatório!`
  }
}

async function validateGetNewNumber (parameters) {
  if(parameters.mac == `` || parameters.mac == undefined || parameters.mac == null) {
    throw `O campo "mac" é obrigatório!`
  }

  if(parameters.clientId == `` || parameters.clientId == undefined || parameters.clientId == null) {
    throw `O campo "clientId" é obrigatório!`
  }
}

async function validateChangeClient (parameters) {
  if(parameters.mac == `` || parameters.mac == undefined || parameters.mac == null) {
    throw `O campo "mac" é obrigatório!`
  }

  if(parameters.clientId == `` || parameters.clientId == undefined || parameters.clientId == null) {
    throw `O campo "clientId" é obrigatório!`
  }
}