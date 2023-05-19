exports = async function(payload, response){
  // This default function will get a value and find a document in MongoDB
  // To see plenty more examples of what you can do with functions see: 
  // https://www.mongodb.com/docs/atlas/app-services/functions/
  let login;
  let password;

  let message = "MinhaSenha";
  
  let encMessage = await context.functions.execute("encryptText", message);
  
  console.log("DEBUG ENC: ", encMessage)
  
  console.log("DEBUG DEC: ", await context.functions.execute("decryptText", encMessage))

  try {
    login = payload.query.login;
    password = payload.query.password;
  } catch(err) {
    login = payload.login;
    password = payload.password;
  }
  return { login: login, password: await context.functions.execute("decryptText", password)};
};
