exports = async function (payload) {
  
  const users = context.services
    .get("mongodb-atlas")
    .db("configRadio")
    .collection("users");

  let login
  let password
  let requestData
  if(payload === "Hello world!") {
    login = 'carlosemilio'
    password = 'YTlhYWFiYWNhZGFlYWZhMA=='
  } else {
    login = payload.login
    password = payload.encryptedPassword    
  }

  const loggedUser = await users.findOne({'login': `${login}`});
  let rawPassword = await context.functions.execute('decryptText', password)
  let encryptedPassword = await context.functions.execute('encryptPassword', rawPassword)
  if(loggedUser.password === encryptedPassword) {
    return { id: loggedUser._id.toString(), login: loggedUser.login, name: loggedUser.exhibitionName, customData: 'This is a custom data'}
  } else {
    throw new Error('Usuário/Senha incorreto(s)')
  }  
 
  // return { 'id': '221435435874384' , 'login': resp.login, 'name': resp.exhibitionName, 'customData': 'asdfasdgçljasdg' }
  // return resp._id.toString()
}





  
  

  // return resp._id.toString()
  
  // return {
  //   "_id": resp._id.toString(),
  //   "id": resp._id.toString(),
  //   "name": "debug"
  // };
  
  
  // 2. Create a new user or log in an existing user in the external
  //    authentication service.
  // You can use a client library from npm
  
  // const user = await context.services.get('mongodb-atlas').db('configRadio').collection('users').findOne({'login': login})
  
  // const auth = require("fake-auth-service");
  // const user = await auth.login({ username, password });
  // // Or you can communicate directly over HTTP
  // const userFromHttp = await context.http.post({
  //   url: "https://example.com/auth/login",
  //   headers: {
  //     Authorization: ["Basic bmlja0BleGFtcGxlLmNvbTpQYTU1dzByZA=="],
  //   },
  //   body: JSON.stringify({ username, password }),
  // });
  // console.log("USER: ", JSON.stringify(user))
  
  
  // 3. Return a unique identifier for the user. Typically this is the
  //    user's ID in the external authentication system or the _id of a
  //    stored MongoDB document that describes them.
  //
  //    !!! This is NOT the user's internal account ID for your app !!!
  // return user._id
  // return user._id;