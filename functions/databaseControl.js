/* eslint-disable no-undef */
// eslint-disable-next-line n/no-exports-assign
exports = async function (data) {
  /**
   * Valida os dados antes de tentar executar a operação no Banco de dados
   */
  try {
    await validate(data)
  } catch (error) {
    throw new Error(`Falha ao validar operação a ser executada no banco de dados! ${error}`)
    // throw `Falha ao executar operação no banco de dados! ${error}`
  }

  /**
   * Prepara dados para a operação
   */
  try {
    data = await preproccess(data)
  } catch (error) {
    let e = error
    if (typeof error === 'object') {
      e = JSON.stringify(error)
    }
    throw new Error(`Falha ao executar pré-processamento dos dados a serem utilizados  na operação (Action: ${data.action}, Collection: ${data.collection}) a ser efetuada no banco de dados! ${e}`)
    // throw `Falha ao executar pré-processamento dos dados a serem utilizados  na operação (Action: ${data.action}, Collection: ${data.collection}) a ser efetuada no banco de dados! ${e}`
  }

  /**
   * Executa a operação no banco de dados
   * Nesse ponto os dados já devem ter sido validados e preparados para a operação
   */
  try {
    return await execute(data)
  } catch (error) {
    let e = error
    if (typeof error === 'object') {
      e = JSON.stringify(error)
    }
    throw new Error(`Falha ao executar operação (${data.action}) na collection ${data.collection}! Erro: ${e}`)
  }
}

/**
 * Valida os dados antes de executar a operação no Banco de Dados
 * @param {*} data
 */
async function validate (parameters) {
  /**
   * Essa verificação é comum a todas as operações
   */
  if (await isEmpty(parameters.action)) {
    throw new Error('É necessário informar a ação a ser realizada!')
  }

  if (await isEmpty(parameters.collection)) {
    throw new Error('É necessário informar uma collection sobre a qual a ação será realizada!')
  }

  if (await isEmpty(parameters.query)) {
    throw new Error('É necessário informar os parâmetros corretamente para realizar a operação!')
  }

  /**
   * As verificações abaixo são específicas para cada operação
   */
  switch (parameters.action) {
    case 'findOne':

      break
    case 'findMany':

      break
    case 'insertOne':

      break
    case 'insertMany':
      if(!Array.isArray(parameters.query)) {
        throw new Error('É necessário fornecer um array como parâmetro para a operação insertMany')
      }
      break
    case 'updateOne':
    case 'findOneAndUpdate':
    case 'updateMany':
      if (await isEmpty(parameters.filter)) {
        throw new Error('É necessário informar um critério para definir quais documentos serão atualizados!')
      }
      break
    case 'deleteOne':

      break
    case 'excludeOne':

      break
    default:
      throw new Error('Ação inválida!')
  }
}

/**
 * Processa os dados antes de executar a(s) operação(ões) no banco de dados
 * @param {*} parameters
 * @returns
 */
async function preproccess (parameters) {
  switch (parameters.action) {
    case 'findOne':
    case 'findMany':
      if (parameters.query._id != null && parameters.query._id !== '') {
        parameters.query._id = new BSON.ObjectId(`${parameters.query._id}`)
      }

      if (!parameters.projection) {
        parameters.projection = {}
      }
      break
    case 'updateOne':
      if (parameters.query._id != null && parameters.query._id !== '') {
        parameters.query._id = new BSON.ObjectId(`${parameters.query._id}`)
      }

      if (parameters.filter._id != null && parameters.filter._id !== '') {
        parameters.filter._id = new BSON.ObjectId(`${parameters.filter._id}`)
      }
      break
  }

  // eslint-disable-next-line eqeqeq
  if (parameters.options == null || parameters.options == '') {
    parameters.options = {}
  }
  return parameters
}

/**
 * Executa a operação escolhida
 * @param {*} parameters
 * @returns
 */
async function execute (parameters) {
  const dbquery = context.services.get('mongodb-atlas').db('configRadio').collection(parameters.collection)
  try {
    switch (parameters.action) {
      case 'findOne':
        if (parameters.projection) {
          return await dbquery.findOne(parameters.query, parameters.projection, parameters.options)
        } else {
          return await dbquery.findOne(parameters.query, parameters.options)
        }
      case 'findMany':
        try {
          if (parameters.projection) {
            let resp = await dbquery.find(parameters.query, parameters.projection, parameters.options)
            return await resp.toArray()
          } else {
            return await dbquery.find(parameters.query, parameters.options)
          }          
        } catch (e) {
          throw new Error ("Falha ao executar a operação findMany no Banco de Dados! ", e)
        }

      case 'insertOne':
        return await dbquery.insertOne(parameters.query, parameters.options)
      case 'insertMany':
        let resp 
        // parameters.query = [{
        //         "Nome": "Central CLE 7\" até 150 pontos",
        //         "SiglaConfRadio": "WBMOD",
        //         "Created Date": "2021-03-22T14:06:00.456Z",
        //         "Created By": "admin_user_firebeemapp_live",
        //         "Modified Date": "2022-11-08T16:53:41.744Z",
        //         "Codigo": "20007",
        //         "SubCategoria": [
        //             "1616086728712x833675765087504100"
        //         ],
        //         "isAtivoVenda": false,
        //         "RadioTypeOLD": "1644656239066x757728565090018600",
        //         "isLiberadoConfig": true,
        //         "DeviceClass": "1",
        //         "RadioType": "Coordenador 1.0",
        //         "_id": "1616421960454x280852625994198370"
        //     }]
        // console.log(" >>>> Query: ", JSON.stringify(parameters.query))
        // console.log(" >>>> Options: ", JSON.stringify(parameters.options))
        try {
          resp = await dbquery.insertMany(parameters.query, parameters.options)
        } catch (e) {
          throw new Error (`Falha ao executar a operação insertMany no Banco de Dados! ${e}`)
        }
        return resp
      case 'updateOne':
        return await dbquery.updateOne(parameters.filter, parameters.query, parameters.options)
      case 'findOneAndUpdate':
        return await dbquery.findOneAndUpdate(parameters.filter, parameters.query, parameters.options)
      case 'updateMany':
        return await dbquery.updateMany(parameters.filter, parameters.query, parameters.options)
      case 'deleteOne':
        return await dbquery.deleteOne(parameters.filter, parameters.options)
      case 'excludeOne':
        return await dbquery.deleteMany(parameters.filter, parameters.options)
    }
  } catch (error) {
    throw new Error({ err: JSON.stringify(error) })
  }
}

async function isEmpty (valueToBeChecked) {
  return (valueToBeChecked == null || valueToBeChecked === '')
}

if (typeof module === 'object') {
  module.exports = exports
}
