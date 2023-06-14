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

  // if ((data.action == `updateOne` || data.action == `updateMany`) && (data.options == null || data.options == `` || data.options == undefined)) {
  //   throw `É necessário informar um critério para definir quais documentos serão atualizados!`
  // }

  if((data.action == `updateOne` || data.action == `updateMany`)  && (data.filter == null || data.filter == `` || data.filter == undefined)) {
    throw `É necessário informar um critério para definir quais documentos serão atualizados!`
  }

  try {
    return await execute(data)
  } catch (error) {
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
        return await dbquery.find(parameters.query)
      case 'insertOne':
        return await dbquery.insertOne(parameters.query, parameters.options)
      case 'insertMany':
        return await dbquery.insertMany(parameters.query, parameters.options)
      case 'updateOne':
        return await dbquery.updateOne(parameters.filter, parameters.query, parameters.options)
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