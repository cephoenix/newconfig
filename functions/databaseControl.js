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
    throw `Falha ao executar pré-processamento dos dados a serem utilizados  na operação a ser efetuada no banco de dados! ${JSON.stringify(error)}`
  }
  throw {debug: data}
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
 * Valida os dados antes de executar a operação no Banco de Dados
 * @param {*} data 
 */
async function validate(parameters) {

  /**
   * Essa verificação é comum a todas as operações
   */
  if (await isEmpty(parameters.action)) {
    throw `É necessário informar a ação a ser realizada!`
  }

  if (await isEmpty(parameters.collection)) {
    throw `É necessário informar uma collection sobre a qual a ação será realizada!`
  }

  if (await isEmpty(parameters.query)) {
    throw `É necessário informar os parâmetros corretamente para realizar a operação!`
  }

  /**
   * As verificações abaixo são específicas para cada operação
   */
  switch (parameters.action) {
    case 'updateOne':
    case `updateMany`:
      if(await isEmpty(parameters.filter)) {
        throw `É necessário informar um critério para definir quais documentos serão atualizados!`
      }
      break;
  }
}


/**
 * Processa os dados antes de executar a(s) operação(ões) no banco de dados
 * @param {*} parameters 
 * @returns 
 */
async function preproccess(parameters) {
  try {
    switch (parameters.action) {
      case 'findOne':
        // cheking parameters.query._id against null or `` may cause undefined exception
        if(parameters.query._id != undefined) {
          parameters.query._id = new BSON.ObjectId(parameters.query._id)
        } else if(parameters.query._id != null && parameters.query._id != ``) {
          parameters.query._id = new BSON.ObjectId(parameters.query._id)
        }

        // cheking parameters.projection against null or `` may cause undefined exception
        if(parameters.projection == undefined) {
          parameters.projection = {}
        } else if(parameters.projection == null || parameters.projection == ``) { 
          parameters.projection = {}
        }
    }
    return parameters;
  } catch (error) {
    throw error
  }
}

/**
 * Executa a operação escolhida
 * @param {*} parameters 
 * @returns 
 */
async function execute(parameters) {
  
  const dbquery = context.services.get("mongodb-atlas").db("configRadio").collection(parameters.collection)
  try {
    switch (parameters.action) {
      case 'findOne':
        return await dbquery.findOne(parameters.query, parameters.projection, parameters.options)
      case 'findMany':
        return await dbquery.find(parameters.query, parameters.projection, parameters.options)
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

async function isEmpty(valueToBeChecked) {
  return  (valueToBeChecked == null || valueToBeChecked == `` || valueToBeChecked== undefined)
}