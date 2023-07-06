exports = async function (payload) {
  // 1. Parse the `payload` object, which holds data from the
  //    FunctionCredential sent by the SDK.
  const { login, encryptedPassword } = payload;
  // 2. Create a new user or log in an existing user in the external
  //    authentication service.
  // You can use a client library from npm
  
  const user = context.services.get('mongodb-atlas').db('configRadio').collection('users').find({login: login})
  
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
  
  
  
  // 3. Return a unique identifier for the user. Typically this is the
  //    user's ID in the external authentication system or the _id of a
  //    stored MongoDB document that describes them.
  //
  //    !!! This is NOT the user's internal account ID for your app !!!
  return 'A87A8E68A87C987B986B9B6'
  // return user._id;
};