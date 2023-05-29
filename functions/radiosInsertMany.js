exports = async function (data) {

  let dbResponse;
  let parameters;

  const dbquery = context.services.get("mongodb-atlas").db("configRadio").collection("radios");

  try {
    dbResponse = await dbquery.insertMany(parameters, {ordered: false})
  } catch (e) {
    throw "Falha ao inserir dados no Banco de Dados!";
  }
};