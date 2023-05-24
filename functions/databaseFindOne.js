exports = async function (data) {
  let parameters;
  return {debug: data}
  if (data.query) {
    try {
      parameters = EJSON.parse(data.query)
    } catch (e) {
      let err = new Error();
      err.message = "Não foi possível buscar as informações no Banco de Dados. Favor conferir os critérios de busca!";
      throw err;
    }
  } else {
    let err = new Error();
    err.message = "É necessário informar os dados corretamente para fazer a pesquisa!";
    throw err;
  }

  if (data.collection === undefined || data.collection === "" || data.collection === null) {
    let err = new Error();
    err.message = "É necessário informar uma collection para fazer a pesquisa!";
    throw err;
  }

  const dbquery = context.services.get("mongodb-atlas").db("configRadio").collection(data.collection);

  if (data.parameters === undefined || data.collection === "" || data.collection === null) {
    let err = new Error();
    err.message = "É necessário informar pelo menos um parâmetro de busca para fazer a pesquisa!";
    throw err;
  }

  try {
    return await dbquery.findOne(parameters)
  } catch (e) {
    let err = new Error();
    err.message = "Não é possível buscar " + data.collection;
    throw err;
  }
};