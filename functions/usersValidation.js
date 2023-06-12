exports = async function (payload) {

  let action
  var body

  try {
    body = payload.body.text()
  } catch (error) {
    throw `Erro ao buscar parâmetros da operação: ${error}`
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
        throw `Nenhuma ação informada!`
      } else {
        throw `Ação (${action}) inválida!`
      }
  }
};

async function validateCreate(body) {
  var parameters

  try {
    parameters = JSON.parse(body)
  } catch (e) {
    throw `Erro ao criar Usuário:  ${e}`
  }

  if(parameters.exhibitionName == `` || parameters.exhibitionName == undefined || parameters.exhibitionName == null) {
    throw `O campo "Nome de exibição" é obrigatório!`
  }

  if(parameters.permissionLevel == `` || parameters.permissionLevel == undefined || parameters.permissionLevel == null) {
    throw `O campo "Nível de permissão" é obrigatório!`
  }

  if(parameters.login == `` || parameters.login == undefined || parameters.login == null) {
    throw `O campo "Login" é obrigatório!`;
  }

  if(parameters.cpfCnpj == `` || parameters.cpfCnpj == undefined || parameters.cpfCnpj == null) {
    throw `O campo "CPF/CNPJ" é obrigatório!`
  }

  query = {
    $or: [
      { "login": parameters.login },
      { "cpfCnpj": parameters.cpfCnpj }
    ]
  }

  try {
    dbResponse = await context.functions.execute(`databaseFindOne`, { query: JSON.stringify(query), collection: `users` })
  } catch (e) {
    throw `Erro ao buscar usuário: ${e}`
  }

  if(dbResponse != undefined && dbResponse != '' && dbResponse != null && dbResponse != {}) {
    throw `Esse usuário já existe!`
  }
}

async function validateFindOne (body) {
  try {
    JSON.parse(body)
  } catch (e) {
    throw `Erro ao buscar usuário:  ${e}`
  }
}

async function validateFindAll (body) {
  try {
    JSON.parse(body)
  } catch (e) {
    throw `Erro ao buscar todos os Usuários:  ${e}`
  }
}

async function validateFindMany (body) {
  try {
    JSON.parse(body)
  } catch (e) {
    throw `Erro ao buscar Usuários:  ${e}`
  }
}

async function validateUpdateOne (body) {
  var parameters
  try {
    parameters = JSON.parse(body)
  } catch (e) {
    throw `Erro ao atualizar Usuário:  ${e}`
  }

  if(parameters.exhibitionName == `` || parameters.exhibitionName == undefined || parameters.exhibitionName == null) {
    throw `O campo "Nome de exibição" é obrigatório!`
  }

  if(parameters.permissionLevel == `` || parameters.permissionLevel == undefined || parameters.permissionLevel == null) {
    throw `O campo "Nível de permissão" é obrigatório!`
  }

  if(parameters.login == `` || parameters.login == undefined || parameters.login == null) {
    throw `O campo "Login" é obrigatório!`;
  }

  if(parameters.cpfCnpj == `` || parameters.cpfCnpj == undefined || parameters.cpfCnpj == null) {
    throw `O campo "CPF/CNPJ" é obrigatório!`
  }

  if(parameters._id == `` || parameters._id == undefined || parameters._id == null) {
    throw `O campo "_id" é obrigatório!`
  }
}

async function validateExcludeOne (body) {
  var parameters
  try {
    parameters = JSON.parse(body)
  } catch (e) {
    throw `Erro ao excluir Usuário:  ${e}`
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
    throw `Erro ao deletar Usuário:  ${e}`
  }

  if(parameters._id == `` || parameters._id == undefined || parameters._id == null) {
    throw `O campo "_id" é obrigatório!`
  }
}