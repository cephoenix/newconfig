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
  /**
 * Ao atualizar um rádio a resposta vai ser o cliente desse rádio com o resumo de dispositivos atualizado
 */

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

async function validateCreate(payload) {
  var parameters

  try {
    parameters = JSON.parse(payload)
  } catch (e) {
    throw `Erro ao criar usuário:  ${e}`
  }

  if(parameters.exhibitionName == `` || parameters.exhibitionName == undefined || parameters.exhibitionName == null) {
    throw "O campo 'Nome de exibição' é obrigatório!";
  }

  if(parameters.permissionLevel == `` || parameters.permissionLevel == undefined || parameters.permissionLevel == null) {
    throw "O campo 'Nível de permissão' é obrigatório!"
  }

  if(parameters.login == `` || parameters.login == undefined || parameters.login == null) {
    throw "O campo 'Login' é obrigatório!";
  }

  if(parameters.cpfCnpj == `` || parameters.cpfCnpj == undefined || parameters.cpfCnpj == null) {
    throw "O campo 'CPF/CNPJ' é obrigatório!"
  }

  query = {
    $or: [
      { "login": parameters.login },
      { "cpfCnpj": parameters.cpfCnpj }
    ]
  }

  try {
    dbResponse = await context.functions.execute('databaseFindMany', { query: JSON.stringify(query), collection: `clients` })
  } catch (e) {
    throw `Erro ao buscar usuário: ${e}`
  }

  throw {
    query: query,
    dbResponse: dbResponse,
    dbResponseStringfied: JSON.stringify(dbResponse),
    moreDebug1: (dbResponse == undefined),
    moreDebug2: (dbResponse == ''),
    moreDebug3: (dbResponse == null),
    moreDebug4: (dbResponse == {}),
    moreDebug5: Object.keys(dbResponse).length
  }

  if(dbResponse != undefined && dbResponse != '' && dbResponse != null && dbResponse != {}) {
    throw `Esse usuário já existe!`
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