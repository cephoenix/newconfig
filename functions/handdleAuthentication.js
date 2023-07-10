exports = async function (payload) {

  const users = context.services
    .get("mongodb-atlas")
    .db("app")
    .collection("users");
      
  if(payload === "Hello world!") {
    let login = 'carlosemilio'
    let encryptedPassword = '21345647684'
    console.log("Payload: ", payload)
    
      
  } else {
    const { login, encryptedPassword } = payload;

    return {debug: {login: login, pass: encryptedPassword} }
  }
   
  const user = await users.findOne({ login });
  
  return user._id.toString();
  
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
};