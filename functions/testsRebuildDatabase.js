exports = async function (data) {
  var parameters;
  var dbResponse;

  parameters = []
  
  context.services.get("mongodb-atlas").db("configRadio").collection("clients").deleteMany({})
  context.services.get("mongodb-atlas").db("configRadio").collection("parameters").deleteMany({})
  context.services.get("mongodb-atlas").db("configRadio").collection("radios").deleteMany({})
  context.services.get("mongodb-atlas").db("configRadio").collection("radiosRecordingLog").deleteMany({})
  context.services.get("mongodb-atlas").db("configRadio").collection("users").deleteMany({})
  context.services.get("mongodb-atlas").db("configRadio").collection("usersLoginLog").deleteMany({})

  dbResponse = await context.services.get("mongodb-atlas").db("configRadio").collection("clients").insertMany([
    {
      "oldDatabaseId": 695,
      "name": "DEV - Carlos Emílio",
      "initials": "CEP",
      "panId": "9994",
      "extendedPanId": "9994",
      "linkKey": "0001",
      "networkKey": "0001",
      "creationDate": new Date(),
      "channel": 26,
      "deviceSummary": {},
      "clientType": {
        type: 2,
        name: "Cliente Final"
      },
      "documentIdentificationNumber": "01412732166",
      "taxId": "01412732166",
      "nationalIdentificationNumber": "01412732166",
      "address": "",
      "postalCode": "",
      "state": "",
      "stateInitials": "",
      "province": "",
      "city": "",
      "country": ""
    },
    {
      "oldDatabaseId": 696,
      "name": "DEV - Jardel",
      "initials": "JJJ",
      "panId": "9993",
      "extendedPanId": "9993",
      "linkKey": "0001",
      "networkKey": "0001",
      "creationDate": new Date(),
      "channel": 26,
      "deviceSummary": {},
      "clientType": {
        type: 2,
        name: "Cliente Final"
      },
      "documentIdentificationNumber": "009993",
      "taxId": "009993",
      "nationalIdentificationNumber": "009993",
      "address": "",
      "postalCode": "",
      "state": "",
      "stateInitials": "",
      "province": "",
      "city": "",
      "country": ""
    },
    {
      "oldDatabaseId": 17,
      "name": "DEV - Robson",
      "initials": "ROB",
      "panId": "9995",
      "extendedPanId": "9995",
      "linkKey": "0001",
      "networkKey": "0001",
      "creationDate": new Date(),
      "channel": 26,
      "deviceSummary": {},
      "clientType": {
        type: 2,
        name: "Cliente Final"
      },
      "documentIdentificationNumber": "009995",
      "taxId": "009995",
      "nationalIdentificationNumber": "009995",
      "address": "",
      "postalCode": "",
      "state": "",
      "stateInitials": "",
      "province": "",
      "city": "",
      "country": ""
    },
    {
      "oldDatabaseId": 686,
      "name": "ADRIANO - TomCRUIZ",
      "initials": "0GQ",
      "panId": "9189",
      "extendedPanId": "17A1826C573EA87E",
      "linkKey": "3FA1A6328EBECBDA3914D41E696FF1D3",
      "networkKey": "A1435FAEE5E6B0771868F6B2C2065B9B",
      "creationDate": new Date(),
      "channel": 26,
      "deviceSummary": {},
      "clientType": {
        type: 2,
        name: "Cliente Final"
      },
      "documentIdentificationNumber": "5435787000166",
      "taxId": "5435787000166",
      "nationalIdentificationNumber": "5435787000166",
      "address": "",
      "postalCode": "",
      "state": "",
      "stateInitials": "",
      "province": "",
      "city": "",
      "country": ""
    },
    {
      "oldDatabaseId": 357,
      "name": "Desenvolvimento 1",
      "initials": "DE1",
      "panId": "9085",
      "extendedPanId": "9085",
      "linkKey": "0001",
      "networkKey": "0001",
      "creationDate": new Date(),
      "channel": 26,
      "deviceSummary": {},
      "clientType": {
        type: 2,
        name: "Cliente Final"
      },
      "documentIdentificationNumber": "009085",
      "taxId": "009085",
      "nationalIdentificationNumber": "009085",
      "address": "",
      "postalCode": "",
      "state": "",
      "stateInitials": "",
      "province": "",
      "city": "",
      "country": ""
    }]
  )
  
  let a = JSON.stringify(dbResponse)
  return JSON.parse(a)
  

  context.services.get("mongodb-atlas").db("configRadio").collection("users").insertOne(
    {
      "login": "jardel0101",
      "password": "EFDA0BD51E79959399756DD0FC4BA89653780EF8",
      "email": "jardel@firebee.com.br",
      "fullName": "Jardel Cândido",
      "exhibitionName": "Jardel",
      "cpfCnpj":"01234567899",
      "zone": "Centro Oeste",
      "permissionLevel": { 
          "level": 0, 
          "description": "Firebee"
      },
      "clients": [
          {
            "id":""+dbResponse.insertedIds[0], 
            "name": "DEV - Carlos Emílio",
            "initials":"CEP",
            "channel":26,
            "clientType":"Admin"
          },
          {
            "id":""+dbResponse.insertedIds[1], 
            "name": "DEV - Jardel",
            "initials":"JJJ",
            "channel":26,
            "clientType":"Admin"
          },
          {
            "id":""+dbResponse.insertedIds[2], 
            "name": "DEV - Robson",
            "initials":"ROB",
            "channel":26,
            "clientType":"Admin"
          },
          {
            "id":""+dbResponse.insertedIds[3], 
            "name": "ADRIANO - TomCRUIZ",
            "initials":"0GQ",
            "channel":26,
            "clientType":"Admin"
          },
          {
            "id":""+dbResponse.insertedIds[4], 
            "name": "Desenvolvimento 1",
            "initials":"DE1",
            "channel":26,
            "clientType":"Admin"
          }
      ],
      "permissions": []
    }
  )

  context.services.get("mongodb-atlas").db("configRadio").collection("users").insertOne(
    {
      "login": "carlosemilio",
      "password": "EFDA0BD51E79959399756DD0FC4BA89653780EF8",
      "email": "carlosemilio@firebee.com.br",
      "fullName": "Carlos Emílio Pereira",
      "exhibitionName": "Carlão",
      "cpfCnpj":"01412732166  ",
      "zone": "Centro Oeste",
      "permissionLevel": { 
          "level": 0, 
          "description": "Firebee"
      },
      "clients": [
        {
          "id":""+dbResponse.insertedIds[0], 
          "name": "DEV - Carlos Emílio",
          "initials":"CEP",
          "channel":26,
          "clientType":"Admin"
        },
        {
          "id":""+dbResponse.insertedIds[1], 
          "name": "DEV - Jardel",
          "initials":"JJJ",
          "channel":26,
          "clientType":"Admin"
        },
        {
          "id":""+dbResponse.insertedIds[2], 
          "name": "DEV - Robson",
          "initials":"ROB",
          "channel":26,
          "clientType":"Admin"
        },
        {
          "id":""+dbResponse.insertedIds[3], 
          "name": "ADRIANO - TomCRUIZ",
          "initials":"0GQ",
          "channel":26,
          "clientType":"Admin"
        },
        {
          "id":""+dbResponse.insertedIds[4], 
          "name": "Desenvolvimento 1",
          "initials":"DE1",
          "channel":26,
          "clientType":"Admin"
        }
      ],
      "permissions": []
    }
  )

  for (let i = 0; i < 10000; i++) {
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
      "clientChannel": 26,
      "clientType": "Desenvolvimento",
      "recordingDate": new Date()
    })
  }
  //forcing a new deploy
  try {
    dbResponse = await context.functions.execute('radiosInsertMany', parameters);
  } catch (e) {
    throw "Erro ao inserir dados no Banco (tests populate radios collection)!" + e
  }

  return dbResponse
}