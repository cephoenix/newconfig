exports = async function (data) {
//   const dbquery = context.services.get("mongodb-atlas").db("configRadio").collection("clients");

//   if (data) {
//     try {
//       parameters = EJSON.parse(data)
//     } catch (e) {
//       throw (e)
//     }
//   } else {
//     let err = new Error();
//     err.name = 'no_data_provided'
//     err.message = "Não é possível pesquisar por um registro em branco";
//     err.code = 3;
//     err.TypeError = 3;
//     throw err;
//   }

//   try {
//     dbResponse = await dbquery.findOne(parameters)
//   } catch (e) {
//     throw (e)
//   }

//   return dbResponse;

  throw `deprecated`
};