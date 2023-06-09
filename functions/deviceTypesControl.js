/* eslint-disable no-undef */
// eslint-disable-next-line n/no-exports-assign
exports = async function (payload) {
  let action
  let operationName
  let operationResponse
  let operationParameters
  let success = true

  try {
    // id, action, page etc should be on url parameters. These parameters are contained inside payload.query
    action = payload.query.action
  } catch (err) {
    action = payload.action
  }

  /**
   * Se tiver alguma verificação geral, que deve ser feita para todas as ações, ela deve ser feita aqui
   * Verificações específicas são feitas dentro de cada uma das operações
   */

  switch (action) {
    case 'findAll':
      operationName = 'databaseFindMany'
      operationParameters = { collection: 'deviceTypes', query: {} }
      break

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
    operationResponse = await context.functions.execute(operationName, operationParameters)
  } catch (e) {
    success = false
    operationResponse = e
  }

  resp.success = success
  resp.data = operationResponse
  return resp
}

if (typeof module === 'object') {
  module.exports = exports
}
