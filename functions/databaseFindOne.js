exports = async function (data) {
  var parameters
  
  if (data.query) {
    try {
      parameters = EJSON.parse(data.query)
    } catch (e) {
      throw `Não foi possível buscar as informações no Banco de Dados. Favor conferir os critérios de busca!`;
    }
  } else {
    throw `É necessário informar os dados corretamente para fazer a pesquisa!`;
  }

  if (data.collection == undefined || data.collection == "" || data.collection == null) {
    throw `É necessário informar uma collection para fazer a pesquisa!`;
  }

  const dbquery = context.services.get("mongodb-atlas").db("configRadio").collection(data.collection)

  try {
    return await dbquery.findOne(parameters)
  } catch (e) {
    throw "Não é possível buscar " + data.collection;
  }
};