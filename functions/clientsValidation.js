exports = async function (payload) {

  const dbquery = context.services.get("mongodb-atlas").db("configRadio").collection("clients")
  let action
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

async function validateCreate (body) {
  var parameters

  try {
    parameters = JSON.parse(body)
  } catch (error) {
    throw `Erro ao inserir cliente (1): ${error}`
  }
  let query = {
    $or: [
      { "initials": parameters.initials },
      { "cpfCnpj": parameters.cpfCnpj },
      { "networkKey": parameters.networkKey },
      { "panId": parameters.panId }
    ]
  }

  try {
    dbResponse = await context.functions.execute('databaseFindOne', { query: JSON.stringify(query), collection: `clients` })
  } catch (e) {
    throw `Erro ao inserir cliente(2): ${e}`
  }
}