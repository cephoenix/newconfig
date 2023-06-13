exports = async function (payload) {

  var headers
  var query
  var body

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