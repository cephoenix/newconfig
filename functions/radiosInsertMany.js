exports = async function (data) {

  let dbResponse;
  let parameters;

  const dbquery = context.services.get("mongodb-atlas").db("configRadio").collection("radios");
return {debug: data}
  try {
    dbResponse = await dbquery.insertMany(data, {ordered: false})
  } catch (e) {
    throw "Falha ao inserir dados no Banco de Dados!" + e;
  }
};