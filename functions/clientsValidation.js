exports = async function (payload) {

  const dbquery = context.services.get("mongodb-atlas").db("configRadio").collection("clients");
  let action;

  try {
    payload.body.text()
  } catch (error) {
    throw {
      success: false,
      data: `Erro ao buscar parâmetros da operação: ${error}`
    }
  }

  action = payload.query.action

  switch (action) {
    case 'create':
      await validateCreate(payload)
      break;

    case 'findOne':
      break;

    case 'findAll':
      break;

    case 'findMany':
      break;

    case 'updateOne':
      break;

    case 'excludeOne':
      break;

    case 'deleteOne':
      break;

    default:
      if (action == null || action == undefined || action == ``) {
        throw `Nenhuma ação informada!`;
      } else {
        throw `Ação (${action}) inválida!`;
      }
  }
};

async function validateCreate (payload) {
  var parameters

  try {
    parameters = JSON.parse(payload)
  } catch (error) {
    throw `Erro ao inserir cliente: ${error}`
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
    dbResponse = await context.functions.execute('databaseFindOne', { query: query, collection: `clients` })
  } catch (e) {
    throw `Erro ao inserir cliente: ${e}`
  }
}