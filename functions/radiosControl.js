exports = async function (payload) {

  let action
  let resp = {}
  let operationName
  let operationResponse
  let operationParameters = {}
    
  /**
   * Ao atualizar um rádio a resposta vai ser o cliente desse rádio com o resumo de dispositivos atualizado
   */

  try {
    await context.functions.execute(`radiosValidation`, payload)
  } catch (error) {
    return {
      success: false,
      data: `Erro ao validar operação com Radio: ${error}`
    }
  }

  /**
   * Se tiver alguma verificação geral, que deve ser feita para todas as ações, ela deve ser feita aqui
   * Verificações específicas são feitas dentro de cada uma das operações
   */

  action = payload.query.action
  operationParameters.collection = `radios`
  operationParameters.query = payload.body.text()

  switch (action) {
    case 'create':
      operationName = 'databaseInsertOne';
      break;

    case 'findOne':
      operationName = 'databaseFindOne';
      break;

    case 'findAll':
      operationName = 'databaseFindMany';
      operationParameters = {};
      break;

    case 'findMany':
      if(payload.body == undefined || payload.body == null) {
        throw "É necessário fornecer informações válidas para pesquisar no Banco de Dados! (1)"
      }
      
      try {
        operationParameters = JSON.parse(payload.body.text())
      } catch (e) {
        throw "É necessário fornecer informações válidas (array) para pesquisar no Banco de Dados! (3)"
      }

      operationName = 'databaseFindMany';
      break;

    case 'updateOne':
      operationName = 'databaseUpdateOne';
      break;

    case 'excludeOne':
      operationName = 'databaseExcludeOne';
      break;

    case 'deleteOne':
      operationName = 'databaseDeleteOne';
      break;

    case 'insertMany':

      if(payload.body == undefined) {
        throw "É necessário fornecer informações válidas para inserir no Banco de Dados! (1)"
      }
      
      if (payload.body == null) {
        throw "É necessário fornecer informações válidas para inserir no Banco de Dados! (2)"
      }

      try {
        operationParameters = JSON.parse(payload.body.text())
      } catch (e) {
        throw "É necessário fornecer informações válidas (array) para inserir no Banco de Dados! (3)"
      }
      operationName = 'radiosInsertMany';
      break;

    default:
      return {
        success: false,
        data: `Ação inválida!`
      }
  }
  
  try {
    operationResponse = await context.functions.execute(operationName, operationParameters)
    return {
      success: true,
      data: operationResponse
    }
  } catch (error) {
    throw {
      success: false,
      data: `Erro ao executar operação ${operationName} em Rádios! ${error}`
    }
  }
};