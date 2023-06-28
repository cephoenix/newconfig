/* eslint-disable no-undef */
// eslint-disable-next-line n/no-exports-assign
exports = async function (data) {
  /**
   * data: {
   *     headers: ...
   *     urlParameters: ...
   *     body: ...
   * }
   */

  const parameters = data.body

  switch (data.urlParameters.action) {
    case 'create':
      await validateCreate(parameters)
      break

    case 'blockUser':
      await validateBlockUser(parameters)
      break

    case 'unblockUser':
      await validateUnblockUser(parameters)
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

    default:
      if (action == null || action === undefined || action === '') {
        throw new Error('Nenhuma ação informada!')
      } else {
        throw new Error(`Ação (${action}) inválida!`)
      }
  }
}

/**
 *
 * @param {*} parameters
 */
async function validateCreate (parameters) {
  if (parameters.login === '' || parameters.login === undefined || parameters.login == null) {
    throw new Error('O campo "Login" é obrigatório!')
  }

  if (parameters.cpfCnpj === '' || parameters.cpfCnpj === undefined || parameters.cpfCnpj == null) {
    throw new Error('O campo "CPF/CNPJ" é obrigatório!')
  }

  if (parameters.exhibitionName === '' || parameters.exhibitionName === undefined || parameters.exhibitionName == null) {
    throw new Error('O campo "Nome de exibição" é obrigatório!')
  }

  if (parameters.permissionLevel === '' || parameters.permissionLevel === undefined || parameters.permissionLevel == null) {
    throw new Error('O campo "Nível de permissão" é obrigatório!')
  }

  query = {
    $or: [
      { login: parameters.login },
      { cpfCnpj: parameters.cpfCnpj }
    ]
  }

  try {
    const databaseParameters = {
      action: 'findOne',
      collection: 'users',
      query: query
    }
    dbResponse = await context.functions.execute('databaseControl', databaseParameters)
  } catch (e) {
    throw new Error(`Erro ao buscar usuário (validação de usuário): ${e}`)
  }

  if (dbResponse !== undefined && dbResponse !== '' && dbResponse != null && dbResponse !== {}) {
    throw new Error('Esse usuário já existe!')
  }
}

async function validateBlockUser (parameters) {
  if (parameters._id === '' || parameters._id === undefined || parameters._id == null) {
    throw new Error('É necessário fornecer o campo "_id" do usuário a ser bloqueado!')
  }
}

async function validateUnblockUser (parameters) {
  if (parameters._id === '' || parameters._id === undefined || parameters._id == null) {
    throw new Error('É necessário fornecer o campo "_id" do usuário a ser desbloqueado!')
  }
}

async function validateFindOne (parameters) {

}

async function validateFindAll (parameters) {

}

async function validateFindMany (parameters) {

}

async function validateUpdateOne (parameters) {
  if (parameters.exhibitionName === '' || parameters.exhibitionName === undefined || parameters.exhibitionName == null) {
    throw new Error('O campo "Nome de exibição" é obrigatório!')
  }

  if (parameters.permissionLevel === '' || parameters.permissionLevel === undefined || parameters.permissionLevel == null) {
    throw new Error('O campo "Nível de permissão" é obrigatório!')
  }

  if (parameters.login === '' || parameters.login === undefined || parameters.login == null) {
    throw new Error('O campo "Login" é obrigatório!')
  }

  if (parameters.cpfCnpj === '' || parameters.cpfCnpj === undefined || parameters.cpfCnpj == null) {
    throw new Error('O campo "CPF/CNPJ" é obrigatório!')
  }

  if (parameters._id === '' || parameters._id === undefined || parameters._id == null) {
    throw new Error('O campo "_id" é obrigatório!')
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
