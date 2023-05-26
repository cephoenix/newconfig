exports = async function (data) {

  let dbResponse;
  let parameters;
return {debug3: data}
  if(data == undefined) {
    throw "É necessário fornecer informações válidas para inserir no Banco de Dados! (1)"
  }
  
  if (data == null) {
    throw "É necessário fornecer informações válidas para inserir no Banco de Dados! (2)"
  }

  try {
    parameters = JSON.parse(data.text())
  } catch (e) {
    throw "É necessário fornecer informações válidas (array) para inserir no Banco de Dados! (3)"
  }

  const dbquery = context.services.get("mongodb-atlas").db("configRadio").collection("radios");

  try {
    dbResponse = await dbquery.insertMany(parameters, {ordered: false})
  } catch (e) {
    throw "Falha ao inserir dados no Banco de Dados!";
  }
};