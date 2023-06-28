/* eslint-disable no-undef */
// eslint-disable-next-line n/no-exports-assign
exports = async function (payload) {
  let action
  let operationName
  let operationResponse
  let operationParameters

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
  let msg
  switch (action) {
    case 'doLogin':
      operationName = 'loginDoLogin'
      operationParameters = payload
      break

    case 'doLoginFull':
      operationName = 'loginDoLoginFull'
      operationParameters = payload.body
      break

    default:
      if (action != null) {
        msg = 'Ação inválida!'
      } else {
        msg = 'Nenhuma ação informada!'
      }
      return { success: false, data: msg }
  }

  try {
    operationResponse = await context.functions.execute(operationName, operationParameters)
  } catch (e) {
    return { success: false, data: e }
  }

  return { success: true, data: operationResponse }
}

if (typeof module === 'object') {
  module.exports = exports
}
