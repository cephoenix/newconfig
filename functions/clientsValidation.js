exports = async function (payload) {

  const dbquery = context.services.get("mongodb-atlas").db("configRadio").collection("clients");
  let action;

  action = payload.query.action

  switch (action) {
    case 'create':
      validateCreate(payload)
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

function validateCreate (payload) {

}