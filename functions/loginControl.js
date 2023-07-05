/* eslint-disable no-undef */
// eslint-disable-next-line n/no-exports-assign
exports = async function (payload) {
  
  payload = {
        "query": {
            "action": "testLogin"
        },
        "headers": {
            "Content-Length": [
                "82"
            ],
            "Postman-Token": [
                "d0658fc9-347e-4d05-9694-e646a23f9881"
            ],
            "X-Envoy-External-Address": [
                "179.73.185.92"
            ],
            "X-Request-Id": [
                "c44179fe-2d37-4138-973f-8fd389aa1fc0"
            ],
            "X-Forwarded-Client-Cert": [
                "By=spiffe://xgen-prod/ns/baas-prod/sa/baas-main;Hash=c68c5aa61293af7317ce95a81111deb355d7f6acdfabeb775e95a468d14f947a;Subject=\"O=MongoDB\\, Inc.,CN=lb-b\";URI=spiffe://xgen-prod/ns/vm-prod/sa/lb-b"
            ],
            "X-Cluster-Client-Ip": [
                "179.73.185.92"
            ],
            "Authorizationkey": [
                "645e4f0a833b23298defbed9"
            ],
            "Accept-Encoding": [
                "gzip, deflate, br"
            ],
            "X-Forwarded-Proto": [
                "https"
            ],
            "Content-Type": [
                "application/json"
            ],
            "User-Agent": [
                "PostmanRuntime/7.32.3"
            ],
            "Accept": [
                "*/*"
            ],
            "X-Forwarded-For": [
                "179.73.185.92"
            ]
        },
        "body": {
            "Subtype": 0,
            "Data": "ewogICAgImxvZ2luIjogImphcmRlbDAxMDEiLAogICAgImVuY3J5cHRlZFBhc3N3b3JkIjogIllUbGhZV0ZpWVdOaFpHRmxZV1poTUE9PSIKfQ=="
        }
    }
    
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
console.log("action", action)
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
