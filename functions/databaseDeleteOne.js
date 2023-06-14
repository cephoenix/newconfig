exports = async function (data) {

  // let dbResponse;
  // let query;
  // let parameters;

  // if (data.collection == undefined || data.collection == `` || data.collection == null) {
  //   throw `É necessário informar uma collection para realizar a operação!`
  // }

  // if (data.query != null && data.query != `` && data.query != undefined) {
  //   try {
  //     parameters = EJSON.parse(data.query)
  //   } catch (e) {
  //     throw `Não foi possível realizar a operação. Favor conferir as informações fornecidas! ${e}`;
  //   }
  // } else {
  //   throw `É necessário informar os dados corretamente para realizar a operação!`
  // }

  // const dbquery = context.services.get("mongodb-atlas").db("configRadio").collection(data.collection)

  // query = { "_id": new BSON.ObjectId(parameters._id) }

  // try {
  //   dbResponse = await dbquery.deleteOne(query)
  // } catch (e) {
  //   throw `Falha ao deletar registro da collection ${data.collection}! ${e}`
  // }

  // return dbResponse
  throw `deprecated`
}