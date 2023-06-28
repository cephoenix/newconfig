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
  
  /**
    * Processa a requisição: Decodifica os dados e depois tranforma em formato JSON
    */
  try {
    processedRequestData = await context.functions.execute('proccessRequest', payload)
  } catch (error) {
    return { success: false, data: error }
  }
  
let processedRequestData = 
    {
      "query": {
          "action": "rebuildDatabase"
      },
      "headers": {
          "Content-Type": [
              "text/plain"
          ],
          "Accept-Encoding": [
              "gzip, deflate, br"
          ],
          "X-Forwarded-For": [
              "200.181.33.155"
          ],
          "X-Forwarded-Proto": [
              "https"
          ],
          "X-Request-Id": [
              "219f8c29-b376-468a-b09f-4a553a6c2134"
          ],
          "X-Forwarded-Client-Cert": [
              "By=spiffe://xgen-prod/ns/baas-prod/sa/baas-main;Hash=c68c5aa61293af7317ce95a81111deb355d7f6acdfabeb775e95a468d14f947a;Subject=\"O=MongoDB\\, Inc.,CN=lb-b\";URI=spiffe://xgen-prod/ns/vm-prod/sa/lb-b"
          ],
          "Accept": [
              "*/*"
          ],
          "Postman-Token": [
              "5b1fa51f-f3f1-4479-8eef-fcbcc38958c4"
          ],
          "Content-Length": [
              "4"
          ],
          "User-Agent": [
              "PostmanRuntime/7.32.3"
          ],
          "X-Envoy-External-Address": [
              "200.181.33.155"
          ],
          "X-Cluster-Client-Ip": [
              "200.181.33.155"
          ]
      },
      "body": {
          "Subtype": 0,
          "Data": "ewoKfQ=="
      }
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
