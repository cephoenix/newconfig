// eslint-disable-next-line n/no-exports-assign
exports = async function (payload) {
  return payload
  let action
  let resp
  let operationName
  let operationResponse
  let operationParameters
  // eslint-disable-next-line no-undef
  const query = await context.services.get('mongodb-atlas').db('configRadio').collection('users')
  try {
    //  id, action, page etc should be on url parameters. These parameters are contained inside payload.query
    action = payload.query.action
  } catch (err) {
    action = payload.action
  }

  /**
   * Se tiver alguma verificação geral, que deve ser feita para todas as ações, ela deve ser feita aqui
   * Verificações específicas são feitas dentro de cada uma das operações
   */
  let retAux
  switch (action) {
    case 'rebuildDatabase':
      operationName = 'testsRebuildDatabase'
      operationParameters = null
      break
    case 'debug':
      retAux = await query.find({})
      retAux = await retAux.toArray()
      return retAux
      /*
      ret.forEach(element => {
        temp.push(element)
      });
      */

      /*
      var temp = JSON.parse(JSON.stringify(ret))
      return {isArray: Array.isArray(ret), ret: ret, lenret: ret.length , iArray2: Array.isArray(temp), temp: temp, lentemp: temp.length}
      */

      // let databaseParameters = {
      //   action: `findMany`,
      //   collection: `clients`,
      //   query: {}
      // }

      // let temp = await context.functions.execute(`databaseControl`, databaseParameters)
      // return {debug: temp}

    default:
      if (action != null) {
        resp.data = 'Ação inválida!'
      } else {
        resp.data = 'Nenhuma ação informada!'
      }

      resp.success = false
      return resp
  }

  try {
    // eslint-disable-next-line no-undef
    operationResponse = await context.functions.execute(operationName, operationParameters)
  } catch (e) {
    throw new Error(`Erro ao executar operação: ${e}`)
  }

  resp.success = true
  resp.data = operationResponse
  return operationResponse
}

if (typeof module === 'object') {
  module.exports = exports
}
