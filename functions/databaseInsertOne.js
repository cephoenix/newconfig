exports = async function (data) {
  let dbResponse;
  let parameters;
  
  if (data.collection === undefined || data.collection === "" || data.collection === null) {
    throw "É necessário informar uma collection onde o registro será inserido!";
  }

  if (data.query === undefined || data.query === "" || data.query === null) {
    throw "É necessário informar os dados do registro a ser inserido!";
  }
  
  const dbquery = context.services.get("mongodb-atlas").db("configRadio").collection(`${data.collection}`)
  
  try {
    parameters = EJSON.parse(data.query)
  } catch (e) {
    throw `Erro ao inserir registro no banco de dados(1): ${e}`
  }
  
  try {
    dbResponse = await dbquery.insertOne(parameters);
  } catch (e) {
    throw `Erro ao inserir registro no banco de dados(2): ${e}`
  }
  return dbResponse
};