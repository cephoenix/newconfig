exports = async function (data) {
  
  // try {
  //   body = payload.body.text()
  // } catch (error) {
  //   throw {
  //     success: false,
  //     data: `Erro ao buscar parâmetros da operação: ${error}`
  //   }
  // }

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

async function validateFindOne (parameters) {

}

async function validateFindAll (parameters) {
  
}

async function validateFindMany (parameters) {
  
}

async function validateUpdateOne (parameters) {
  if(parameters._id == null || parameters._id == "" || parameters._id == undefined) {
    throw "É necessário informar o ObjectId do documento a ser atualizado!"
  }
}

async function validateExcludeOne (parameters) {
  
}

async function validateDeleteOne (parameters) {
  
}