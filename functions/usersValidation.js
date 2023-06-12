exports = async function (payload) {

  const dbquery = context.services.get("mongodb-atlas").db("configRadio").collection("users")
  let action
  // var success = true
  // let operationName
  // var operationResponse
  // var resp = {}
  // var operationParameters = {}
  var body

  try {
    body = payload.body.text()
  } catch (error) {
    throw {
      success: false,
      data: `Erro ao buscar parâmetros da operação: ${error}`
    }
  }

  action = payload.query.action
  /**
 * Ao atualizar um rádio a resposta vai ser o cliente desse rádio com o resumo de dispositivos atualizado
 */

  operationParameters.collection = `users`

  switch (action) {
    case 'create':
      await validateCreate(body)
      break;

    case 'findOne':
      await validateFindOne(body)
      break;

    case 'findAll':
      await validateFindAll(body)
      break;

    case 'findMany':
      await validateFindMany(body)
      break;

    case 'updateOne':
      await validateUpdateOne(body)
      break;

    case 'excludeOne':
      await validateExcludeOne(body)
      break;

    case 'deleteOne':
      await validateDeleteOne(body)
      break;

    default:
      if (action == null || action == undefined || action == ``) {
        throw `Nenhuma ação informada!`;
      } else {
        throw `Ação (${action}) inválida!`;
      }
  }
};

async function validateCreate(payload) {


  try {
    parameters = EJSON.parse(data)
  } catch (e) {
    throw `Erro ao criar usuário:  ${e}`
  }

  if(!parameters.exhibitionName) {
    throw "O campo 'Nome de exibição' é obrigatório!";
  }

  if(!parameters.permissionLevel) {
    throw "O campo 'Nível de permissão' é obrigatório!"
  }

  query = {
    $or: [
      { "login": parameters.login },
      { "cpfCnpj": parameters.cpfCnpj }
    ]
  }

  try {
    dbResponse = await context.functions.execute('databaseFindMany', { query: query, collection: `clients` })
  } catch (e) {
    throw `Erro ao buscar usuário: ${e}`
  }

  if(dbResponse != undefined) {
    throw `Usuário já existe`
  }
}

async function validateFindOne (body) {

}

async function validateFindAll (body) {
  
}

async function validateFindMany (body) {
  
}

async function validateUpdateOne (body) {
  
}

async function validateExcludeOne (body) {
  
}

async function validateDeleteOne (body) {
  
}