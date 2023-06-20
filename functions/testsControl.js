
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
        var ret = await context.services.get("mongodb-atlas").db("configRadio").collection(`users`).find({})
        var temp = []
        // ret.forEach(element => {
        //   temp.push(element)
        // });
        return {size: temp.length, retornou: ret[0] }
        // let databaseParameters = {
        //   action: `findMany`,
        //   collection: `clients`,
        //   query: {}
        // }

        // let temp = await context.functions.execute(`databaseControl`, databaseParameters)
        // return {debug: temp}
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