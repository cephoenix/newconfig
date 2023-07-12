/* eslint-disable no-undef */
// eslint-disable-next-line n/no-exports-assign
exports = async function (authEvent) {
  const {
    user: { id }
  } = authEvent

  let databaseParameters = {
    action: 'findOne',
    collection: 'users',
    query: { _id: authEvent.user.identities[0].id }
  }

  const loggedUser = await context.functions.execute('databaseControl', databaseParameters)

  databaseParameters = {
    action: 'findMany',
    collection: 'deviceTypes',
    query: {
      class: {
        $ne: '6'
      }
    },
    filter: {}
  }

  const deviceTypes = await context.functions.execute('databaseControl', databaseParameters)

  databaseParameters = {
    action: 'findOne',
    collection: 'parameters',
    query: { name: 'softwareVersion' },
    filter: {}
  }

  const softwareVersion = await context.functions.execute('databaseControl', databaseParameters)

  const customUserData = context.services
    .get('mongodb-atlas')
    .db('configRadio')
    .collection('customUserData')
  const query = { _id: id }
  
  const update = {
    $set: {
      userId: loggedUser._id,
      login: loggedUser.login,
      exhibitionName: loggedUser.exhibitionName,
      fullName: loggedUser.fullName,
      permissionLevel: loggedUser.permissionLevel,
      clients: loggedUser.clients,
      permissions: loggedUser.permissions,
      // loggedUser,
      softwareVersion: softwareVersion.value,
      lastLogIn: new Date()
    }
  }
  const options = { upsert: true }
  await customUserData.updateOne(query, update, options)
  
  // context.user.custom_data.lastLogIn = new Date()
  // return {debug: true}
}
