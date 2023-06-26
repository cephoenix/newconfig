exports = async function (data) {

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
    throw `Falha ao executar pré-processamento dos dados a serem utilizados  na operação (Action: ${data.action}, Collection: ${data.collection}) a ser efetuada no banco de dados! ${JSON.stringify(error)}`
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
      if (await isEmpty(parameters.filter)) {
        throw `É necessário informar um critério para definir quais documentos serão atualizados!`
      }
      break;
    case 'findOne':

      break;
    case 'findMany':

      break;
    case 'insertOne':
      
      break;
    case 'insertMany':
      
      break;
    case 'updateOne':
      
      break;
    case `findOneAndUpdate`:
      
      break;
    case 'updateMany':
      
      break;
    case 'deleteOne':
      
      break;
    case 'excludeOne':
      
      break;
    default:
      throw `Ação inválida.`
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
      case 'findMany':
      case 'updateOne':

        // cheking parameters.query._id against null or `` may cause undefined exception
        if (parameters.query._id != undefined) {
          // throw {ponto1: {query: parameters.query, ooid: new BSON.ObjectId(parameters.query._id)}}
          parameters.query._id = new BSON.ObjectId(parameters.query._id)
        } else if (parameters.query._id != null && parameters.query._id != ``) {
          parameters.query._id = new BSON.ObjectId(parameters.query._id)
        }

        // cheking parameters.projection against null or `` may cause undefined exception
        if (parameters.projection == undefined) {
          parameters.projection = null
        } else if (parameters.projection == ``) {
          parameters.projection = null
        }
        break;
    }

    if (parameters.options == undefined) {
      parameters.options = {}
    } else if (parameters.options == ``) {
      parameters.options = {}
    }
    return parameters;

  } catch (error) {
    if(parameters.collection == `clients`) {
      throw {debug2: true}
    }
    throw error
  }
}

/**
 * Executa a operação escolhida
 * @param {*} parameters 
 * @returns 
 * 
   >>>>> Exemplo de findOne 
   >>>>> Veja a comparação com undefined... essa é a forma correta de verificar se o registro foi encontrado

  let databaseParameters = {
    action: `findOne`,
    collection: `clients`,
    query: { _id: requestData.clientId }
  }
  
  client = await context.functions.execute(`databaseControl`, databaseParameters)

  if(client == undefined) {
    return {success: false, data: `Não foi possível encontrar o cliente informado`}
  }

 * 
 */
async function execute(parameters) {
  const dbquery = context.services.get("mongodb-atlas").db("configRadio").collection(parameters.collection)
  try {
    switch (parameters.action) {
      case 'findOne':
        if (parameters.projection == null) {
          return await dbquery.findOne(parameters.query, parameters.options)
        } else {
          return await dbquery.findOne(parameters.query, parameters.projection, parameters.options)
        }
      case 'findMany':
        if (parameters.projection == null) {
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
      case `findOneAndUpdate`:
        return await dbquery.findOneAndUpdate(parameters.filter, parameters.query, parameters.options)
      case 'updateMany':
        return await dbquery.updateMany(parameters.filter, parameters.query, parameters.options)
      case 'deleteOne':
        return await dbquery.deleteOne(parameters.filter, parameters.options)
      case 'excludeOne':
        return await dbquery.deleteMany(parameters.filter, parameters.options)
    }
  } catch (error) {
    throw {err: JSON.stringify(error)}
  }
}

async function isEmpty(valueToBeChecked) {
  return (valueToBeChecked == null || valueToBeChecked == `` || valueToBeChecked == undefined)
}