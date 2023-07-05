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

    case 'testLogin':

      /**
        * Processa a requisição: Decodifica os dados e depois tranforma em formato JSON
        */
      try {
        processedRequestData = await context.functions.execute('proccessRequest', payload)
      } catch (error) {
        return { success: false, data: error }
      }

      /**
       * Ao atualizar um rádio a resposta vai ser o cliente desse rádio com o resumo de dispositivos atualizado
       */
      try {
        await context.functions.execute('loginValidation', processedRequestData)
      } catch (error) {
        return { success: false, data: error }
      }

      await doLogin()
      break

    default:
      return { success: false, data: 'Ação inválida!' }
  }

  try {
    operationResponse = await context.functions.execute(operationName, operationParameters)
  } catch (e) {
    return { success: false, data: e }
  }

  return { success: true, data: operationResponse }
}

async function doLogin (requestData) {

}

if (typeof module === 'object') {
  module.exports = exports
}
