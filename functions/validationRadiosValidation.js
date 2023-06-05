exports = async function (payload) {

  const dbquery = context.services.get("mongodb-atlas").db("configRadio").collection("radios")
  let action
  var success = true
  let operationName
  var operationResponse
  var resp = {}
  var operationParameters = {}
  var parameterToValidate

  try {
    //id, action, page etc should be on url parameters. These parameters are contained inside payload.query
    action = payload.query.action;
  } catch (err) {
    throw "Ação inválida! Por favor forneça uma ação válida."
  }

  operationParameters.collection = `radios`

  switch (action) {
    case 'create':
      try {
        parameterToValidate = JSON.parse(payload.body.text())
      } catch (error) {
        throw `Erro ao inserir/atualizar Rádio (Parâmetros inválidos): ${error}`
      }
      validateCreate(parameterToValidate)
      break;

    case 'findOne':
      
      break;

    case 'findAll':

      break;

    case 'findMany':
      
      break;

    case 'updateOne':
      try {
        parameterToValidate = JSON.parse(payload.body.text())
      } catch (error) {
        throw `Erro ao inserir/atualizar Rádio (Parâmetros inválidos): ${error}`
      }
      validateUpdate(payload.text())
      break;

    case 'excludeOne':
      
      break;

    case 'deleteOne':
      
      break;

    // case 'updateMany':
    //   // resultado = await dbquery.updateOne(
    //   //   args.filter, 
    //   //   [
    //   //     {$set: args.values}
    //   //   ]
    //   // );
    //   break;

    // case 'excludeMany':
    //   // resultado = await dbquery.updateOne(
    //   //   args.filter, 
    //   //   [
    //   //     {$set: {status : "removed", DataExclusao : "passa data" , deletedAt: new Date()}}
    //   //   ]
    //   // );
    //   break;

    default:
      success = false
      if (action != null) {
        response = "Ação inválida!";
      } else {
        response = "Nenhuma ação informada!";
      }
  }

  try {
    operationResponse = await context.functions.execute(operationName, operationParameters);
  } catch (e) {
      success = false
      operationResponse = e.message
  }

  resp.success = success
  resp.data = operationResponse
  return resp
};

function validateCreate (params) {
  if(params.clientOID == undefined || params.clientOID == null || params.clientOID == "") {
    throw `É necessário informar o ID do Cliente ao qual o Rádio pertence!`
  }  
}

function validateUpdate (params) {
  if(params.clientOID == undefined || params.clientOID == null || params.clientOID == "") {
    throw `É necessário informar o ID do Cliente ao qual o Rádio pertence!`
  }
}