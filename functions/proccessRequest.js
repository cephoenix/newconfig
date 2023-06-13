exports = async function (payload) {

  // var headers
  // var query
  var body

  if(payload.body == undefined || payload.body == `` || payload.body == null) {
    body = {}
  } else {
    try {
      return {debug: payload.body, typeof: typeof payload.body}
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