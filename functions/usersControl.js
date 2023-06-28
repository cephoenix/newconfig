/* eslint-disable no-undef */
// eslint-disable-next-line n/no-exports-assign
exports = async function (payload) {
  const databaseCollection = 'users'
  let databaseAction
  let databaseQuery
  let databaseFilter
  let processedRequestData

  /**
   * Processa a requisição: Decodifica os dados e depois tranforma em formato JSON
   */
  try {
    processedRequestData = await context.functions.execute('proccessRequest', payload)
  } catch (error) {
    return { success: false, data: error }
  }

  /**
   * Valida os dados de acordo com a ação requisitada
   */
  try {
    await context.functions.execute('usersValidation', processedRequestData)
  } catch (error) {
    return { success: false, data: error }
  }

  /**
   * Executa algum tratamento antes, se necessário, e depois faz a operação com o Banco de Dados
   */
  databaseQuery = processedRequestData.body
  let userToBlock
  let userToUnblock
  let userToExclude

  switch (processedRequestData.urlParameters.action) {
    case 'create':
      try {
        databaseQuery.password = await context.functions.execute('decryptText', databaseQuery.password)
      } catch (e) {
        return { success: false, data: `Erro ao decriptografar a senha fornecida: ${e}` }
      }

      try {
        databaseQuery.password = await context.functions.execute('encryptPassword', databaseQuery.password)
      } catch (e) {
        return { success: false, data: `Erro ao encriptar a senha a ser gravada no Banco de Dados: ${e}` }
      }

      databaseAction = 'insertOne'
      databaseQuery.blocked = true // All users are blocked by default. Someone with the right permission level needs to activate them
      break

    case 'blockUser':
      try {
        userToBlock = await blockUser(databaseQuery)
      } catch (error) {
        return { success: false, data: error }
      }
      databaseAction = 'updateOne'
      databaseQuery = userToBlock
      databaseFilter = { _id: databaseQuery._id }
      break

    case 'unblockUser':
      try {
        userToUnblock = await unblockUser(databaseQuery)
      } catch (error) {
        return { success: false, data: error }
      }

      databaseAction = 'updateOne'
      databaseQuery = userToUnblock
      databaseFilter = { _id: databaseQuery._id }
      break

      // case `excludeUser`:
      //   try {
      //     userToUnblock = await excludeUser(databaseQuery);
      //   } catch (error) {
      //     return { success: false, data: error }
      //   }

      //   databaseAction = `updateOne`
      //   databaseQuery = userToExclude
      //   databaseFilter = { _id: databaseQuery._id}
      //   break;

    case 'findOne':
      databaseAction = 'findOne'
      break

    case 'findAll':
      databaseAction = 'findMany'
      databaseQuery = {}
      break

    case 'findMany':
      databaseAction = 'findMany'
      break

    case 'updateOne':
      databaseAction = 'updateOne'
      break

    case 'excludeOne':
      try {
        userToExclude = await prepareUserForExclusion(databaseQuery)
      } catch (error) {
        return { success: false, data: error }
      }

      databaseAction = 'updateOne'
      databaseQuery = userToExclude
      databaseFilter = { _id: databaseQuery._id }
      break

    case 'deleteOne':
      databaseAction = 'deleteOne'
      break

    default:
      return { success: false, data: 'Ação inválida!' }
  }

  try {
    const databaseParameters = {
      action: databaseAction,
      collection: databaseCollection,
      query: databaseQuery,
      filter: databaseFilter
    }

    return {
      success: true,
      data: await context.functions.execute('databaseControl', databaseParameters)
    }
  } catch (error) {
    return { success: false, data: JSON.stringify(error) }
  }
}

/**
 * @param {*} parameters
 * @returns
 */
async function blockUser (parameters) {
  let userToBlock
  /**
   * Preparing to block
   */
  databaseParameters = {
    action: 'findOne',
    collection: 'users',
    query: { _id: parameters._id }
  }

  try {
    userToBlock = await context.functions.execute('databaseControl', databaseParameters)
  } catch (error) {
    throw new Error(`Falha ao buscar usuário a ser bloqueado! ${error}`)
  }

  // if (typeof userToBlock.blocked === 'object') {
  //   if (Object.keys(userToBlock.blocked).length === 0) {
  //     throw new Error('')
  //   }
  // }

  if (userToBlock.blocked != null && userToBlock.blocked === true) { // Tem que verificar com undefined senão dá pau
    throw new Error('Esse usuário já está bloqueado!')
  }

  userToBlock.blocked = true
  return userToBlock
}

/**
 *
 * @param {*} parameters
 * @returns
 */
async function unblockUser (parameters) {
  let userToUnblock
  /**
   * Preparing to unblock
   */
  databaseParameters = {
    action: 'findOne',
    collection: 'users',
    query: { _id: parameters._id }
  }

  try {
    userToUnblock = await context.functions.execute('databaseControl', databaseParameters)
  } catch (error) {
    throw new Error(`Falha ao buscar usuário a ser desbloqueado! ${error}`)
  }

  if (userToUnblock.blocked === undefined || userToUnblock.blocked === false || userToUnblock.blocked == null || userToUnblock.blocked === '') {
    throw new Error('Esse usuário já está desbloqueado!')
  }

  userToUnblock.blocked = false
  return userToUnblock
}

async function prepareUserForExclusion (parameters) {
  let userToExclude
  /**
   * Preparing to exclude
   */
  databaseParameters = {
    action: 'findOne',
    collection: 'users',
    query: { _id: parameters._id }
  }

  try {
    userToExclude = await context.functions.execute('databaseControl', databaseParameters)
  } catch (error) {
    throw new Error(`Falha ao buscar usuário a ser excluído! ${JSON.stringify(error)}`)
  }

  if (userToExclude.exclusionDate != null && userToExclude.exclusionDate !== '') {
    userToExclude.exclusionDate = new Date()
  } else {
    throw new Error('Esse usuário já está excluído!')
  }

  return userToExclude
}
