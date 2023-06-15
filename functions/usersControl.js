exports = async function (payload) {

  var action
  const databaseCollection = `users`
  var databaseAction
  var databaseQuery
  var databaseFilter
  var requestData
  var databaseParameters
  
  /**
   * Processa a requisição: Decodifica os dados e depois tranforma em formato JSON
   */
  try {
    requestData = await context.functions.execute(`proccessRequest`, payload)
  } catch (error) {
    return { success: false, data: error}
  }

  /**
   * Valida os dados de acordo com a ação requisitada
   */
  try {
    await context.functions.execute(`usersValidation`, requestData)
  } catch (error) {
    return { success: false, data: error}
  }

  /**
   * Executa algum tratamento antes, se necessário, e depois faz a operação com o Banco de Dados
   */
  action = requestData.urlParameters.action
  databaseQuery = requestData.body

  switch (action) {
    case 'create':
      try {
        databaseQuery.password = await context.functions.execute("decryptText", databaseQuery.password);
      } catch (e) {
        return { success: false, data: `Erro ao decriptografar a senha fornecida: ${e}`}
      }
  
      try {
        databaseQuery.password = await context.functions.execute("encryptPassword", databaseQuery.password);
      } catch (e) {
        return { success: false, data: `Erro ao encriptar a senha a ser gravada no Banco de Dados: ${e}`}
      }

      databaseAction = `insertOne`
      databaseQuery.blocked = true                                         // All users are blocked by default. Someone with the right permission level needs to activate them
      break;

    case `blockUser`:
      var userToBlock
      try {
        var userToBlock = await blockUser(databaseQuery);
      } catch (error) {
        return { success: false, data: error }
      }
       
      // /**
      //  * Preparing to block
      //  */
      // databaseParameters = {
      //   action: `findOne`,
      //   collection: `users`,
      //   query: { _id: databaseQuery._id }
      // }

      // try {
      //   userToBlock = await context.functions.execute(`databaseControl`, databaseParameters)
      // } catch (error) {
      //   return { success: false, data: `Falha ao buscar usuário a ser bloqueado! ${error}`}
      // }

      // if(userToBlock.blocked == true) {
      //   return { success: false, data: `Esse usuário já está bloqueado!`}
      // }
      
      // userToBlock.blocked = true

      /**
       * Updating register after 'blocked' field has been set to true
       */
      databaseAction = `updateOne`
      databaseQuery = userToBlock
      databaseFilter = {_id: databaseQuery._id}
      
      break;

    case `unblockUser`:
      var userToUnblock 
      
      try {
        userToUnblock = await unblockUser(databaseQuery);  
      } catch (error) {
        return { success: false, data: error }
      }
      
      // /**
      //  * Preparing to unblock
      //  */
      // databaseParameters = {
      //   action: `findOne`,
      //   collection: `users`,
      //   query: { _id: databaseQuery._id }
      // }

      // try {
      //   userToUnblock = await context.functions.execute(`databaseControl`, databaseParameters)
      // } catch (error) {
      //   return { success: false, data: `Falha ao buscar usuário a ser desbloqueado! ${error}`}
      // }

      // if(userToUnblock.blocked == false || userToUnblock.blocked == undefined || userToUnblock.blocked == null || userToUnblock.blocked == ``) {
      //   return { success: false, data: `Esse usuário já está desbloqueado!`}
      // }

      // userToUnblock.blocked = false

      /**
       * Updating register after 'blocked' field has been set to true
       */
      databaseAction = `updateOne`
      databaseQuery = userToUnblock
      databaseFilter = { _id: databaseQuery._id}
      
      break;

    case 'findOne':
      databaseAction = `findOne`
      break;

    case 'findAll':
      databaseAction = `findMany`
      databaseQuery = {}
      break;

    case 'findMany':
      databaseAction = `findMany`
      break;

    case 'updateOne':
      databaseAction = `updateOne`
      break;

    case 'excludeOne':
      databaseAction = `excludeOne`
      break;

    case 'deleteOne':
      databaseAction = `deleteOne`
      break;

    default:
      return { success: false, data: `Ação inválida!`}
  }

  try {

    let databaseParameters = {
      action: databaseAction,
      collection: databaseCollection,
      query: databaseQuery,
      filter: databaseFilter
    }

    return {
      success: true,
      data: await context.functions.execute(`databaseControl`, databaseParameters)
    }

  } catch (error) {
    return { success: false, data: error }
  }
};

/**
 * 
 * @param {*} parameters 
 */
async function createUser(parameters) {

}

/**
 * 
 * @param {*} parameters 
 * @returns 
 */
async function blockUser(parameters) {
  var userToBlock
  /**
   * Preparing to block
   */
  databaseParameters = {
    action: `findOne`,
    collection: `users`,
    query: { _id: parameters._id }
  }

  try {
    userToBlock = await context.functions.execute(`databaseControl`, databaseParameters)
  } catch (error) {
    return { success: false, data: `Falha ao buscar usuário a ser bloqueado! ${error}`}
  }
throw {debug: userToBlock}
  if(userToBlock.blocked == true || userToBlock.blocked == undefined || userToBlock.blocked == null || userToBlock.blocked == ``) {
    return { success: false, data: `Esse usuário já está bloqueado!`}
  }
  
  userToBlock.blocked = true

  return userToBlock
}

/**
 * 
 * @param {*} parameters 
 * @returns 
 */
async function unblockUser(parameters) {
  let userToUnblock
  /**
   * Preparing to unblock
   */
  databaseParameters = {
    action: `findOne`,
    collection: `users`,
    query: { _id: databaseQuery._id }
  }

  try {
    userToUnblock = await context.functions.execute(`databaseControl`, databaseParameters)
  } catch (error) {
    return { success: false, data: `Falha ao buscar usuário a ser desbloqueado! ${error}`}
  }

  if(userToUnblock.blocked == false || userToUnblock.blocked == undefined || userToUnblock.blocked == null || userToUnblock.blocked == ``) {
    return { success: false, data: `Esse usuário já está desbloqueado!`}
  }

  userToUnblock.blocked = false
  return userToBlock
}