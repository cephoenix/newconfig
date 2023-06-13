exports = async function(data){

  if (data.action == undefined || data.action == "" || data.action == null) {
    throw `É necessário informar uma ação a ser realizada!`
  }

  if (data.collection == undefined || data.collection == "" || data.collection == null) {
    throw `É necessário informar uma collection realizar a operação!`
  }

  if (data.query == null || data.query == `` || data.query == undefined) {
    throw `É necessário informar os dados corretamente para realizar a operação!`
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
        dbquery.findOne(parameters.query)
        break;
      case 'findMany':
        dbquery.findMany(parameters.query)
        break;
      case 'insertOne':
        dbquery.insertOne(parameters.query)
        break;
      case 'insertMany':
        dbquery.insertMany(parameters.query)
        break;
      case 'updateOne':
        dbquery.updateOne(parameters.query)
        break;
      case 'updateMany':
        dbquery.updateMany(parameters.query)
        break;
      case 'deleteOne':
        dbquery.deleteOne(parameters.query)
        break;
      case 'excludeOne':
        dbquery.updateOne(parameters.query)
        break;
      default:
        throw `Operação inválida! ${action}`
    }
  } catch (error) {
    throw error
  }
}