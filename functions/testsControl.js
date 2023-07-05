/* eslint-disable no-undef */
// eslint-disable-next-line n/no-exports-assign
exports = async function (payload) {
  let action
  let operationName
  let operationParameters
  let processedRequestData
  let msg

  /**
    * Processa a requisição: Decodifica os dados e depois tranforma em formato JSON
    */
  try {
    processedRequestData = await context.functions.execute('proccessRequest', payload)
  } catch (error) {
    return { success: false, data: error }
  }

  // processedRequestData =
  // {
  //   "headers": {
  //       "Accept": [
  //           "*/*"
  //       ],
  //       "Postman-Token": [
  //           "a49fe3a8-730b-443f-9c2a-2c1721c5412e"
  //       ],
  //       "Content-Length": [
  //           "4"
  //       ],
  //       "Content-Type": [
  //           "text/plain"
  //       ],
  //       "X-Forwarded-For": [
  //           "200.181.33.155"
  //       ],
  //       "X-Request-Id": [
  //           "afa2f969-c880-4bc8-9497-5a7c01d21e5c"
  //       ],
  //       "X-Forwarded-Client-Cert": [
  //           "By=spiffe://xgen-prod/ns/baas-prod/sa/baas-main;Hash=c68c5aa61293af7317ce95a81111deb355d7f6acdfabeb775e95a468d14f947a;Subject=\"O=MongoDB\\, Inc.,CN=lb-b\";URI=spiffe://xgen-prod/ns/vm-prod/sa/lb-b"
  //       ],
  //       "X-Cluster-Client-Ip": [
  //           "200.181.33.155"
  //       ],
  //       "User-Agent": [
  //           "PostmanRuntime/7.32.3"
  //       ],
  //       "Accept-Encoding": [
  //           "gzip, deflate, br"
  //       ],
  //       "X-Forwarded-Proto": [
  //           "https"
  //       ],
  //       "X-Envoy-External-Address": [
  //           "200.181.33.155"
  //       ]
  //   },
  //   "urlParameters": {
  //       "action": "debug"
  //   },
  //   "body": {}
  // }

  /**
  * Se tiver alguma verificação geral, que deve ser feita para todas as ações, ela deve ser feita aqui
  * Verificações específicas são feitas dentro de cada uma das operações
  */
  switch (processedRequestData.urlParameters.action) {
    case 'rebuildDatabase':
      operationName = 'testsRebuildDatabase'
      operationParameters = null
      break
    case 'debug':
      return {
        debug: context
      }

    default:
      if (action != null) {
        msg = 'Ação inválida!'
      } else {
        msg = 'Nenhuma ação informada!'
      }
      return { success: false, data: msg }
  }

  try {
    // eslint-disable-next-line no-undef
    await context.functions.execute(operationName, operationParameters)
  } catch (e) {
    throw new Error(`Erro ao executar operação: ${e}`)
  }

  return { success: true, data: 'Reconstrução do Banco de Dados realizada com sucesso!' }
}

if (typeof module === 'object') {
  module.exports = {
    exports
  }
}
