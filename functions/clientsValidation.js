exports = async function (data) {
  
  // try {
  //   body = payload.body.text()
  // } catch (error) {
  //   throw {
  //     success: false,
  //     data: `Erro ao buscar parâmetros da operação: ${error}`
  //   }
  // }
  return {debug: data}
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

    default:
      if (action == null || action == undefined || action == ``) {
        throw `Nenhuma ação informada!`;
      } else {
        throw `Ação (${action}) inválida!`;
      }
  }
};

async function validateCreate (parameters) {

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