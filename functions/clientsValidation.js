exports = async function (payload) {

  let action
  var body

  try {
    body = payload.body.text()
  } catch (error) {
    throw {
      success: false,
      data: `Erro ao buscar parâmetros da operação: ${error}`
    }
  }

  action = payload.query.action

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
        throw `Nenhuma ação informada!`;
      } else {
        throw `Ação (${action}) inválida!`;
      }
  }
};

async function validateCreate (body) {
  var parameters

  try {
    parameters = EJSON.parse(body)
  } catch (error) {
    throw `Erro ao inserir cliente (1): ${error}`
  }

  let query = {
    $or: [
      { "initials": parameters.initials },
      { "cpfCnpj": parameters.cpfCnpj },
      { "networkKey": parameters.networkKey },
      { "panId": parameters.panId }
    ]
  }

  try {
    // let resp = await context.functions.execute('databaseFindOne', { query: JSON.stringify(query), collection: `clients` })
    if(await context.functions.execute('databaseFindOne', { query: JSON.stringify(query), collection: `clients` }) != null) {
      throw `Esse cliente já existe!`
    }
    // throw {debug: JSON.stringify(resp), a: resp == null}
  } catch (error) {
    throw `Erro ao inserir cliente(2): ${error}`
  }
}

async function validateFindOne (body) {

}

async function validateFindAll (body) {
  
}

async function validateFindMany (body) {
  
}

async function validateUpdateOne (body) {
  
}

async function validateExcludeOne (body) {
  
}

async function validateDeleteOne (body) {
  
}