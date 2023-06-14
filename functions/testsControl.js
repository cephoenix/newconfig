exports = async function (payload) {
  
  let action
  var resp = {}
  let operationName
  let operationResponse
  let operationParameters
  let success = true

  try {
    //id, action, page etc should be on url parameters. These parameters are contained inside payload.query
    action = payload.query.action
  } catch (err) {
    action = payload.action
  }

  /**
   * Se tiver alguma verificação geral, que deve ser feita para todas as ações, ela deve ser feita aqui
   * Verificações específicas são feitas dentro de cada uma das operações
   */

  switch (action) {
      case 'rebuildDatabase':
        operationName = 'testsRebuildDatabase'
        operationParameters = null
        break;
      case 'debug':
        
        // await context.services.get("mongodb-atlas").db("configRadio").collection(`users`).findOne(
        //   {"_id": new BSON.ObjectId('647f7bf836742bf8539e457a')}
        // )
        return {debug: await context.services.get("mongodb-atlas").db("configRadio").collection(`radiosRecordingLog`).insertOne({debug: true, date: new Date()})}
        
        break;

    default:
      if (action != null) {
        resp.data = `Ação inválida!`
      } else {
        resp.data = `Nenhuma ação informada!`
      }

      resp.success = false
      return resp
  }

  try {
    operationResponse = await context.functions.execute(operationName, operationParameters);
  } catch (e) {
    throw `Erro ao executar operação: ${e}`
  }

  resp.success = success
  resp.data = operationResponse
  return operationResponse
};