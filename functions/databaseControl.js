exports = async function(data){

  if (data.action == undefined || data.action == "" || data.action == null) {
    throw `É necessário informar a ação a ser realizada!`
  }

  if (data.collection == undefined || data.collection == "" || data.collection == null) {
    throw `É necessário informar uma collection sobre a qual a ação será realizada!`
  }

  if (data.query == null || data.query == `` || data.query == undefined) {
    throw `É necessário informar os parâmetros corretamente para realizar a operação!`
  }

  try {
    return await execute(data)
  } catch (error) {
    return {debug2: error}
    throw `Falha ao executar operação (${data.action}) na collection ${data.collection}! Erro: ${error}`
  }
};

async function execute(parameters) {
  
  const dbquery = context.services.get("mongodb-atlas").db("configRadio").collection(parameters.collection)
  try {
    switch (parameters.action) {
      case 'findOne':
        return await dbquery.findOne(parameters.query)
      case 'findMany':
        return await dbquery.findMany(parameters.query)
      case 'insertOne':
        return await dbquery.insertOne(parameters.query)
      case 'insertMany':
        return await dbquery.insertMany(parameters.query)
      case 'updateOne':
        return await dbquery.updateOne(parameters.query)
      case 'updateMany':
        return await dbquery.updateMany(parameters.query)
      case 'deleteOne':
        return await dbquery.deleteOne(parameters.query)
      case 'excludeOne':
        return await dbquery.updateOne(parameters.query)
      default:
        throw `Operação inválida! Operação informada: ${action}`
    }
  } catch (error) {
    throw error
  }
}