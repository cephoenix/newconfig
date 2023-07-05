/* eslint-disable no-undef */
// eslint-disable-next-line n/no-exports-assign
exports = async function (payload) {
  
  let action
  let operationName
  let operationResponse
  let operationParameters

  // if(payload === 'Hello world!') {

  //   payload = {
  //     "query": {
  //         "action": "testLogin"
  //     },
  //     "headers": {
  //         "User-Agent": [
  //             "PostmanRuntime/7.32.3"
  //         ],
  //         "X-Forwarded-For": [
  //             "179.73.185.92"
  //         ],
  //         "X-Envoy-External-Address": [
  //             "179.73.185.92"
  //         ],
  //         "Content-Type": [
  //             "application/json"
  //         ],
  //         "Content-Length": [
  //             "82"
  //         ],
  //         "X-Forwarded-Proto": [
  //             "https"
  //         ],
  //         "X-Request-Id": [
  //             "94bce265-bc36-44d4-b3d1-9575f43988a2"
  //         ],
  //         "X-Forwarded-Client-Cert": [
  //             "By=spiffe://xgen-prod/ns/baas-prod/sa/baas-main;Hash=c68c5aa61293af7317ce95a81111deb355d7f6acdfabeb775e95a468d14f947a;Subject=\"O=MongoDB\\, Inc.,CN=lb-b\";URI=spiffe://xgen-prod/ns/vm-prod/sa/lb-b"
  //         ],
  //         "X-Cluster-Client-Ip": [
  //             "179.73.185.92"
  //         ],
  //         "Accept": [
  //             "*/*"
  //         ],
  //         "Postman-Token": [
  //             "6899a606-b081-4876-9509-bbb341c2ac4b"
  //         ],
  //         "Accept-Encoding": [
  //             "gzip, deflate, br"
  //         ],
  //         "Authorizationkey": [
  //             "645e4f0a833b23298defbed9"
  //         ]
  //     },
  //     "body": {
  //         "Subtype": 0,
  //         "Data": "ewogICAgImxvZ2luIjogImphcmRlbDAxMDEiLAogICAgImVuY3J5cHRlZFBhc3N3b3JkIjogIllUbGhZV0ZpWVdOaFpHRmxZV1poTUE9PSIKfQ=="
  //     }
  //   }    
  // }
  
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
return {debug: true}
      try {
        return {success: true, data: await doLogin(processedRequestData.body)}
      } catch (error) {
        return { success: false, data: error }
      }
      
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

async function doLogin (data) {



}

if (typeof module === 'object') {
  module.exports = exports
}
