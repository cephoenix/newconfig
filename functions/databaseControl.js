/* eslint-disable no-undef */
// eslint-disable-next-line n/no-exports-assign
exports = async function (data) {
  /**
   * Valida os dados antes de tentar executar a operação no Banco de dados
   */
  try {
    await validate(data)
  } catch (error) {
    throw new Error(`Falha ao validar operação a ser executada no banco de dados! ${error}`)
    // throw `Falha ao executar operação no banco de dados! ${error}`
  }

  /**
   * Prepara dados para a operação
   */
  try {
    data = await preproccess(data)
  } catch (error) {
    let e = error
    if (typeof error === 'object') {
      e = JSON.stringify(error)
    }
    throw new Error(`Falha ao executar pré-processamento dos dados a serem utilizados  na operação (Action: ${data.action}, Collection: ${data.collection}) a ser efetuada no banco de dados! ${e}`)
    // throw `Falha ao executar pré-processamento dos dados a serem utilizados  na operação (Action: ${data.action}, Collection: ${data.collection}) a ser efetuada no banco de dados! ${e}`
  }

  /**
   * Executa a operação no banco de dados
   * Nesse ponto os dados já devem ter sido validados e preparados para a operação
   */
  try {
    return await execute(data)
  } catch (error) {
    let e = error
    if (typeof error === 'object') {
      e = JSON.stringify(error)
    }
    throw new Error(`Falha ao executar operação (${data.action}) na collection ${data.collection}! Erro: ${e}`)
  }
}

/**
 * Valida os dados antes de executar a operação no Banco de Dados
 * @param {*} data
 */
async function validate (parameters) {
  /**
   * Essa verificação é comum a todas as operações
   */
  if (await isEmpty(parameters.action)) {
    throw new Error('É necessário informar a ação a ser realizada!')
  }

  if (await isEmpty(parameters.collection)) {
    throw new Error('É necessário informar uma collection sobre a qual a ação será realizada!')
  }

  if (await isEmpty(parameters.query)) {
    throw new Error('É necessário informar os parâmetros corretamente para realizar a operação!')
  }

  /**
   * As verificações abaixo são específicas para cada operação
   */
  switch (parameters.action) {
    case 'findOne':

      break
    case 'findMany':

      break
    case 'insertOne':

      break
    case 'insertMany':

      break
    case 'updateOne':
    case 'findOneAndUpdate':
    case 'updateMany':
      if (await isEmpty(parameters.filter)) {
        throw new Error('É necessário informar um critério para definir quais documentos serão atualizados!')
      }
      break
    case 'deleteOne':

      break
    case 'excludeOne':

      break
    default:
      throw new Error('Ação inválida!')
  }
}

/**
 * Processa os dados antes de executar a(s) operação(ões) no banco de dados
 * @param {*} parameters
 * @returns
 */
async function preproccess (parameters) {
  switch (parameters.action) {
    case 'findOne':
    case 'findMany':
      if (parameters.query._id != null && parameters.query._id !== '') {
        parameters.query._id = new BSON.ObjectId(`${parameters.query._id}`)
      }

      if (parameters.projection == null || parameters.projection === '') {
        parameters.projection = null
      }
      break
    case 'updateOne':
      if (parameters.query._id != null && parameters.query._id !== '') {
        parameters.query._id = new BSON.ObjectId(`${parameters.query._id}`)
      }

      if (parameters.filter._id != null && parameters.filter._id !== '') {
        parameters.filter._id = new BSON.ObjectId(`${parameters.filter._id}`)
      }
      break
  }

  // eslint-disable-next-line eqeqeq
  if (parameters.options == null || parameters.options == '') {
    parameters.options = {}
  }
  // throw {debug2: true, data: parameters}
  return parameters
}

/**
 * Executa a operação escolhida
 * @param {*} parameters
 * @returns
 */
async function execute (parameters) {
  const dbquery = context.services.get('mongodb-atlas').db('configRadio').collection(parameters.collection)
  try {
    switch (parameters.action) {
      case 'findOne':
        if (parameters.projection) {
          return await dbquery.findOne(parameters.query, parameters.options)
        } else {
          return await dbquery.findOne(parameters.query, parameters.projection, parameters.options)
        }
      case 'findMany':
        return {deb: true}
        if (parameters.projection) {
          return await dbquery.find(parameters.query, parameters.options)
        } else {
          return await dbquery.find(parameters.query, parameters.projection, parameters.options)
        }
      case 'insertOne':
        return await dbquery.insertOne(parameters.query, parameters.options)
      case 'insertMany':
        return await dbquery.insertMany(parameters.query, parameters.options)
      case 'updateOne':
        return await dbquery.updateOne(parameters.filter, parameters.query, parameters.options)
      case 'findOneAndUpdate':
        return await dbquery.findOneAndUpdate(parameters.filter, parameters.query, parameters.options)
      case 'updateMany':
        return await dbquery.updateMany(parameters.filter, parameters.query, parameters.options)
      case 'deleteOne':
        return await dbquery.deleteOne(parameters.filter, parameters.options)
      case 'excludeOne':
        return await dbquery.deleteMany(parameters.filter, parameters.options)
    }
  } catch (error) {
    throw new Error({ err: JSON.stringify(error) })
  }
}

async function isEmpty (valueToBeChecked) {
  return (valueToBeChecked == null || valueToBeChecked === '')
}

if (typeof module === 'object') {
  module.exports = exports
}
