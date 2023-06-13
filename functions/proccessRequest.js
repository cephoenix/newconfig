exports = async function (payload) {

  // var headers
  // var query
  var body
  // return {debug: payload.body, typeof: typeof payload.body, istrue: (typeof payload.body == 'undefined'), objectkeys: Object.keys(payload.body)}
  if(payload.body == undefined || payload.body == `` || payload.body == null || payload.body == 'undefined' || (typeof payload.body == 'undefined')) {
    body = {}
  } else {
    try {
      
      body = JSON.parse(payload.body.text())
    } catch (error) {
      throw `Erro ao processar corpo da requisição. Verifique os dados fornecidos! Erro: ${error}`
    }
  }

  // try {
  //   headers = JSON.parse(payload.headers)
  // } catch (error) {
  //   throw `Erro ao processar cabeçalhos! ${error}`
  // }

  // try {
  //   query = JSON.parse(payload.query)
  // } catch (error) {
  //   throw `Erro ao processar operações/ações! ${error}`
  // }

  // try {
  //   body = JSON.parse(payload.body)
  // } catch (error) {
  //   throw `Erro ao processar parâmetros! ${error}`
  // }

  return {
    headers: payload.headers,
    query: payload.query,
    body: body,
    debug: JSON.parse(payload.body.text())
  }
};