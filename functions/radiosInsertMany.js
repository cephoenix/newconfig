exports = async function (data) {
  const dbquery = context.services.get("mongodb-atlas").db("configRadio").collection("radios");
  try {
    return await dbquery.insertMany(data, {ordered: false})
  } catch (e) {
    throw "Falha ao inserir dados no Banco de Dados!" + e;
  }
};