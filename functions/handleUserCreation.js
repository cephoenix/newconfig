/*
  This function will run after a user is created and is called with an object representing that user.

  This function runs as a System user and has full access to Services, Functions, and MongoDB Data.

  Example below:

  exports = ({ user }) => {
    // use collection that Custom User Data is configured on
    const collection = context.services.get("<SERVICE_NAME>").db("<DB_NAME>").collection("<COLL_NAME>");

    // insert custom data into collection, using the user id field that Custom User Data is configured on
    const doc = collection.insertOne({ <USER_ID_FIELD>: user.id, name: user.data.name });
  };
*/

exports = async(user) => {

  
  let databaseParameters = {
    action: 'findOne',
    collection: 'users',
    query: { _id: user.identities[0].id }
  }

  const loggedUser = await context.functions.execute('databaseControl', databaseParameters)
  
  const credentials = { login: loggedUser.login, password: loggedUser.password, internal: true}
  const ret = await context.auth.login(credentials)
  // throw new Error( JSON.stringify({usuario: user}) )
  return;
};
