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

    default:
      if (action == null || action === '') {
        throw new Error('Nenhuma ação informada!')
      } else {
        throw new Error(`Ação (${action}) inválida!`)
      }
  }
}

async function validateCreate (parameters) {
  const query = {
    $or: [
      { initials: parameters.initials },
      { cpfCnpj: parameters.cpfCnpj },
      { networkKey: parameters.networkKey },
      { panId: parameters.panId }
    ]
  }

  // try {
  //   resp = await context.functions.execute('databaseFindOne', { query: JSON.stringify(query), collection: `clients` })
  // } catch (error) {
  //   throw `Erro ao verificar se o cliente já existe: ${error}`
  // }

  const databaseParameters = {
    action: 'findOne',
    collection: 'clients',
    query
  }

  return {
    success: true,
    data: await context.functions.execute('databaseControl', databaseParameters)
  }
}

async function validateFindOne (parameters) {

}

async function validateFindAll (parameters) {

}

async function validateFindMany (parameters) {

}

async function validateUpdateOne (parameters) {
  if (parameters._id == null || parameters._id === '') {
    throw new Error('É necessário informar o ObjectId do documento a ser atualizado!')
  }
}

async function validateExcludeOne (parameters) {

}

async function validateDeleteOne (parameters) {

}
