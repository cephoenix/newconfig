exports = async function (payload) {

  let action
  var body

  try {
    body = payload.body.text()
  } catch (error) {
    throw `Erro ao buscar parâmetros da operação: ${error}`
  }

  switch (action) {
    case 'create':
      await validateCreate(body)
      break;

    case 'findOne':
      await validateFindOne(body)
      break;

    case 'findAll':
      await validateFindAll(body)
      break;

    case 'findMany':
      await validateFindMany(body)
      break;

    case 'updateOne':
      await validateUpdateOne(body)
      break;

    case 'excludeOne':
      await validateExcludeOne(body)
      break;

    case 'deleteOne':
      await validateDeleteOne(body)
      break;

    default:
      if (action == null || action == undefined || action == ``) {
        throw `Nenhuma ação informada!`
      } else {
        throw `Ação (${action}) inválida!`
      }
  }
};

async function validateCreate (data) {
  var parameters

  try {
    parameters = JSON.parse(data)
  } catch (e) {
    throw `Erro ao criar Radio:  ${e}`
  }

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

async function validateFindOne (body) {
  try {
    JSON.parse(body)
  } catch (e) {
    throw `Erro ao buscar Rádio:  ${e}`
  }
}

async function validateFindAll (data) {
  try {
    JSON.parse(data)
  } catch (e) {
    throw `Erro ao buscar todos os Rádios:  ${e}`
  }
}

async function validateFindMany (body) {
  try {
    JSON.parse(body)
  } catch (e) {
    throw `Erro ao buscar Rádios:  ${e}`
  }
}

async function validateUpdateOne (body) {
  var parameters
  try {
    parameters = JSON.parse(body)
  } catch (e) {
    throw `Erro ao atualizar Rádio:  ${e}`
  }

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

async function validateExcludeOne (body) {
  var parameters
  try {
    parameters = JSON.parse(body)
  } catch (e) {
    throw `Erro ao excluir Rádio:  ${e}`
  }

  if(parameters._id == `` || parameters._id == undefined || parameters._id == null) {
    throw `O campo "_id" é obrigatório!`
  }
}

async function validateDeleteOne (body) {
  var parameters
  try {
    parameters = JSON.parse(body)
  } catch (e) {
    throw `Erro ao deletar Rádio:  ${e}`
  }

  if(parameters._id == `` || parameters._id == undefined || parameters._id == null) {
    throw `O campo "_id" é obrigatório!`
  }
}