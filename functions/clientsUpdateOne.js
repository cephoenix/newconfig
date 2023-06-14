exports = async function (data) {

  // let dbResponse;
  // let resp = {};
  // let query;
  // const dbquery = context.services.get("mongodb-atlas").db("configRadio").collection("clients");

  // if (data == null || data == "" || data == undefined) {
  //   try {
  //     parameters = EJSON.parse(data)
  //   } catch (e) {
  //     throw `Erro ao atualizar documento: ${e}`
  //   }
  // } else {
  //   throw "Não é possível atualizar um registro em branco"
  // }

  // if(parameters._id == null || parameters._id == "" || parameters._id == undefined) {
  //   throw "É necessário informar o ObjectId do documento a ser atualizado!"
  // }

  // // query = {"_id": new BSON.ObjectId(parameters._id)}
  // query = { "_id": parameters._id }

  // try {
  //   dbResponse = await dbquery.updateOne(query, parameters, { upsert: false })
  // } catch (e) {
  //   throw `Erro ao atualizar documento: ${e}`
  // }

  // return dbResponse

  throw `deprecated`
};