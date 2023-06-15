exports = async function(data){

  /**
   * Valida os dados antes de tentar executar a operação no Banco de dados
   */
  try {
    await validate(data)
  } catch (error) {
    throw `Falha ao executar operação no banco de dados! ${error}`
  }

  /**
   * Prepara dados para a operação
   */
  try {
    data = await preproccess(data)
  } catch (error) {
    throw `Falha ao executar pré-processamento dos dados a serem utilizados  na operação a ser efetuada no banco de dados! ${error}`
  }

  /**
   * Executa a operação no banco de dados
   * Nesse ponto os dados já devem ter sido validados e preparados para a operação
   */
  try {
    return await execute(data)
  } catch (error) {
    throw `Falha ao executar operação (${data.action}) na collection ${data.collection}! Erro: ${error}`
  }
};

/**
 * Executa a operação especificada no banco de dados
 * @param {*} parameters 
 * @returns 
 */
async function execute(parameters) {
  
  const dbquery = context.services.get("mongodb-atlas").db("configRadio").collection(parameters.collection)
  try {
    switch (parameters.action) {
      case 'findOne':
        return await context.services.get("mongodb-atlas").db("configRadio").collection(`users`).findOne(parameters.query)
      case 'findMany':
        return await dbquery.find(parameters.query)
      case 'insertOne':
        return await dbquery.insertOne(parameters.query, parameters.options)
      case 'insertMany':
        return await dbquery.insertMany(parameters.query, parameters.options)
      case 'updateOne':
        return await dbquery.updateOne(parameters.filter, parameters.query, parameters.options)
      case `findOneAndUpdate`:
        return await dbquery.findOneAndUpdate(parameters.filter, parameters.query, parameters.options )
      case 'updateMany':
        return await dbquery.updateMany(parameters.filter, parameters.query, parameters.options)
      case 'deleteOne':
        return await dbquery.deleteOne(parameters.filter, parameters.options)
      case 'excludeOne':
        return await dbquery.deleteMany(parameters.filter, parameters.options)
      default:
        throw `Ação inválida.`
    }
  } catch (error) {
    throw error
  }
}

/**
 * Valida os dados antes de executar a operação no Banco de Dados
 * @param {*} data 
 */
async function validate(parameters) {

  /**
   * Essa verificação é comum a todas as operações
   */
  if (parameters.action == undefined || parameters.action == "" || parameters.action == null) {
    throw `É necessário informar a ação a ser realizada!`
  }

  if (parameters.collection == undefined || parameters.collection == "" || parameters.collection == null) {
    throw `É necessário informar uma collection sobre a qual a ação será realizada!`
  }

  if (parameters.query == null || parameters.query == `` || parameters.query == undefined) {
    throw `É necessário informar os parâmetros corretamente para realizar a operação!`
  }

  /**
   * As verificações abaixo são específicas para cada operação
   */
  switch (parameters.action) {
    case 'updateOne':
    case `updateMany`:
      if(parameters.filter == null || parameters.filter == `` || parameters.filter == undefined) {
        throw `É necessário informar um critério para definir quais documentos serão atualizados!`
      }
      break;
  }
}

/**
 * Proccess data before perform database operation
 * @param {*} parameters 
 * @returns 
 */
async function preproccess(parameters) {
  try {
    switch (parameters.action) {
      case 'findOne':
        if(parameters.query._id != null && parameters.query._id != `` && parameters.query._id != undefined) {
          parameters.query._id = new BSON.ObjectId(parameters.query._id)
        }
    }
    return parameters;
  } catch (error) {
    throw error
  }
}