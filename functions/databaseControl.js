exports = async function(data){

  var parameters

  if (data.action == undefined || data.action == "" || data.action == null) {
    throw `É necessário informar uma ação a ser realizada!`
  }

  if (data.collection == undefined || data.collection == "" || data.collection == null) {
    throw `É necessário informar uma collection realizar a operação!`
  }

  if (data.query != null && data.query != `` && data.query != undefined) {
    // try {
    //   parameters = EJSON.parse(data.query)
    // } catch (e) {
    //   throw `Não foi possível buscar as informações no Banco de Dados. Favor conferir os parâmetros informados!`
    // }
  } else {
    throw `É necessário informar os dados corretamente para realizar a operação!`
  }

  const dbquery = context.services.get("mongodb-atlas").db("configRadio").collection(data.collection)

  return { result: findResult };
};