/* eslint-disable no-undef */
// eslint-disable-next-line n/no-exports-assign
exports = async function (authEvent) {
  const {
    user: { id }
  } = authEvent

  let databaseParameters = {
    action: 'findOne',
    collection: 'users',
    query: { _id: id/*login: data.login*/ }
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
      loggedUser,
      softwareVersion: softwareVersion.value,
      deviceTypes: deviceTypes,
      lastLogIn: new Date()
    }
  }
  const options = { upsert: true }
  await customUserData.updateOne(query, update, options)
  context.user.custom_data.lastLogIn = new Date()
}
