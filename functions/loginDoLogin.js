exports = async function (payload) {
  var parameters;
  var loggedUser;
  var data = payload.body
  var remoteIp = payload.headers['X-Cluster-Client-Ip'][0]

  if (data == undefined) {
    throw "É necessário fornecer informações válidas para autenticação! (1)"
  }

  if (data == null) {
    throw "É necessário fornecer informações válidas para autenticação! (2)"
  }

  try {
    parameters = JSON.parse(data.text())
  } catch (e) {
    throw "É necessário fornecer informações válidas para autenticação! (3)"
  }

  if (parameters.login == null || parameters.encryptedPassword == null) {
    throw "É necessário fornecer informações válidas para autenticação! (4)"
  }

  if (parameters.login == undefined || parameters.encryptedPassword == undefined) {
    throw "É necessário fornecer informações válidas para autenticação! (5)"
  }

  try {
    loggedUser = await context.services.get("mongodb-atlas").db("configRadio").collection("users").findOne({"login":parameters.login})
  } catch (e) {
    throw "Erro ao buscar usuário no Banco de Dados! " + e
  }

  if (loggedUser == null) {
    throw "Senha ou usuário incorretos!"
  }

  let decryptedPassword = await context.functions.execute("decryptText", parameters.encryptedPassword) ///Decriptografa a senha e depois aplica o hash nela
  let hashedPass = await context.functions.execute("encryptPassword", decryptedPassword)

  const dbquery = context.services.get("mongodb-atlas").db("configRadio").collection("usersLoginLog")
  
  if (loggedUser.password !== hashedPass) {
    try {
      await dbquery.insertOne({ login: parameters.login, success: false, clientIp: remoteIp, date: new Date() })
    } catch (e) {
      throw (e)
    }

    throw "Senha ou usuário incorretos!"
  }

  try {
    await dbquery.insertOne({ login: parameters.login, success: true, clientIp: remoteIp, date: new Date() })
  } catch (e) {
    throw (e)
  }

  /**
   * get deviceTypes
   */

  var response = await context.http.get({
    url: "https://app.firebee.com.br/api/1.1/obj/Products/",
    requestHeaders: {
      "Content-Type": ["application/json"],
      Authorization: "Bearer 0b6336226cbe51d8b47e2f04b70de602"
    },
    body: {},
    encodeBodyAsJSON: true
  })
  
  var rawData = JSON.parse(response.body.text()).results
  return {debug: JSON.parse(response.body.text())}
  var deviceTypes = []

  rawData.forEach(element => {
    deviceTypes.push({
      productCode: element.Codigo,
      initials: element.SiglaConfRadio,
      class: element.DeviceClass,
      description: element.Nome
    })
  });

  return { 
    "sessionId": "A52B7A89FE6A3BA58D8C", 
    loggedUser: loggedUser , 
    deviceTypes: deviceTypes
    // deviceTypes: [
    //   {
    //     id: 142,
    //     initials: "LRAIR",
    //     description: "Acionador Manual IP67 Long Range",
    //     deviceClass: 3,
    //     productCode: 21241
    //   },
    //   {
    //     id: 141,
    //     initials: "LRDFT",
    //     description: "Detector de Fumaça/Termo Long Range 2.0",
    //     deviceClass: 4,
    //     productCode: 21314
    //   },
    //   {
    //     id: 151,
    //     initials: "LRRIF",
    //     description: "Repetidor com Sirene e Visual 2.0",
    //     deviceClass: 5,
    //     productCode: 21166
    //   },
    //   {
    //     id: 149,
    //     initials: "LRPFH",
    //     description: "Coordenador LRPFH",
    //     deviceClass: 6,
    //     productCode: 21005
    //   }
    // ]
  }  //@todo implementar mecanismo de sessão
}