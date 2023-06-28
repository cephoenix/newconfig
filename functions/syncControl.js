/* eslint-disable no-undef */
// eslint-disable-next-line n/no-exports-assign
exports = async function (payload) {
  const dbquery = context.services.get('mongodb-atlas').db('configRadio').collection('syncCollection')

  let parsedInfo
  const resp = []

  try {
    parsedInfo = JSON.parse(payload.body.text())
  } catch (error) {
    return { success: false, data: error }
  }

  parsedInfo.forEach(async element => {
    // Busca o cliente no Mongo baseado no ID que veio do Mysql
    let client = await dbquery.find({ id: element.id })
    /**
     * Estou usando Find pra poder transformar em um array e verificar o tamanho da resposta.
     * Foi o único jeito que encontrei de verificar se o cliente já está inserido no Mongo
     */
    client = await client.toArray()

    if (client.length === 0) { // Se o array não tiver elementos é por que não foi encontrado cliente com esse ID
      dbquery.insertOne(element) // Então eu faço a inserção dele no Mongo DB
      resp.push({ id: element.id, sigla: element.sigla, nome: element.nome }) // E também adiciono ele no array de resposta
    }
  })
  return resp
}
