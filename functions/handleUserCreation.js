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
  throw new Error(user)
  const requestResponse = await context.http.get({
    url: 'https://realm.mongodb.com/api/client/v2.0/app/application-0-xrtcd/auth/providers/custom-function/login',
    body: {
      login: user.login,
      password: user.password
    },
    encodeBodyAsJSON: true
  })

  return;
};
