exports = async function (payload) {

  var action
  const databaseCollection = `users`
  var databaseAction
  var databaseQuery
  var requestData
  var databaseParameters
  
  try {
    requestData = await context.functions.execute(`proccessRequest`, payload)
  } catch (error) {
    return { success: false, data: error}
  }

  try {
    await context.functions.execute(`usersValidation`, requestData)
  } catch (error) {
    return { success: false, data: error}
  }

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
      databaseQuery.blocked = true                                                                           // All users are blocked by default. Someone with the right permission level need to activate them
      break;

    case `blockUser`:
      let userToBlock
      /**
       * Preparing to block
       */
      databaseParameters = {
        action: `findOne`,
        collection: `users`,
        query: { "_id": databaseQuery._id }
      }

      try {
        userToBlock = await context.functions.execute(`databaseControl`, databaseParameters)
      } catch (error) {
        throw `Falha ao buscar usuário a ser bloqueado! ${error}`
      }

      return {foundUser: userToBlock, dbParameters: databaseParameters}

      if(userToBlock.blocked == true) {
        throw `Esse usuário já está bloqueado!`
      }
      
      userToBlock.blocked = true

      /**
       * Updating register after 'blocked' field has been set to true
       */
      databaseAction = `updateOne`
      databaseQuery = userToBlock
      
      break;

    case `unblockUser`:
      
      let userToUnblock
      /**
       * Preparing to unblock
       */
      databaseParameters = {
        action: `findOne`,
        collection: `users`,
        query: { "_id": parameters._id }
      }

      try {
        userToUnblock = await context.functions.execute(`databaseControl`, databaseParameters)
      } catch (error) {
        throw `Falha ao buscar usuário a ser bloqueado! ${error}`
      }

      if(userToUnblock.blocked == false) {
        throw `Esse usuário já está desbloqueado!`
      }
      
      userToUnblock.blocked = false

      /**
       * Updating register after 'blocked' field has been set to true
       */
      databaseAction = `updateOne`
      databaseQuery = userToUnblock
      
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
      query: databaseQuery
    }

    return {
      success: true,
      data: await context.functions.execute(`databaseControl`, databaseParameters)
    }

  } catch (error) {
    return { success: false, data: error }
  }
};