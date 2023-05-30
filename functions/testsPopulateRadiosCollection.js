exports = async function (data) {
  var parameters;
  var dbResponse;

  parameters = []

  for (let i = 0; i < 1000; i++) {
    parameters.push({
      "address64Bit": "00000000000000" + i,
      "address16Bits": "000" + i,
      "oldDatabaseId": "" + i,
      "name": "DE1_LRDFT000" + i,
      "number": "" + i,
      "firmwareVersion": "18.11.14.01",
      "hardwareVersion": "23.05.23.01",
      "profileId": ""+i,
      "manufacturerId": "1",
      "group": "LRDFT",
      "connectionRouterAddress": "00:25:96:FF:FE:12:34:56",
      "deviceTypeId": "1",
      "deviceTypeInitials": "LRDFT",
      "deviceTypeName": "Long Range Smoke Detector",
      "deviceTypeDescription": "Detector de Fumaça/Termo Long Range 2.0",
      "deviceClass": "1",
      "productCode": "1",
      "status": "unused",
      "clientOID": "6465411ff2e979495fbf7556",
      "clientName": "Carlos Emílio",
      "clientInitials": "CEP",
      "clientChannel": " 26",
      "clientType": "Desenvolvimento"
    });
  }
  //forcing a new deploy
  try {
    dbResponse = await context.functions.execute('radiosInsertMany', parameters);
  } catch (e) {
    throw "Erro ao inserir dados no Banco (tests populate radios collection)!" + e
  }

  return dbResponse
}