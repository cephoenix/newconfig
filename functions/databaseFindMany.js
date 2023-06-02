exports = async function (data) {
  var parameters;
return {debug: data}
  if (data.collection === undefined || data.collection === "" || data.collection === null) {
    throw "É necessário informar uma collection para fazer a pesquisa!";
  }

  if (data.query) {
    try {
      parameters = EJSON.parse(data.query)
    } catch (e) {
      throw "Não foi possível buscar as informações no Banco de Dados. Favor conferir os critérios de busca!";
    }
  } else {
    throw "É necessário informar parâmetros de busca para a pesquisa!";
  }

  const dbquery = context.services.get("mongodb-atlas").db("configRadio").collection(data.collection)

  try {
    return await dbquery.find(parameters)
  } catch (e) {
    throw "Não é possível buscar dados da tabela: " + data.collection + " Erro: " + e
  }
};