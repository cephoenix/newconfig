/* eslint-disable no-undef */
// eslint-disable-next-line n/no-exports-assign
exports = async function (authEvent) {
  const {
    user: { id }
  } = authEvent

  const customUserData = context.services
    .get('mongodb-atlas')
    .db('configRadio')
    .collection('customUserData')
  const query = { _id: id }
  const update = {
    $set: {
      lastLogIn: new Date(),
      userId: 'asdf'+authEvent.identities[0],
      custom: 'This is a custom user data... updated every time user logs on',
      debug: JSON.stringify(authEvent)
    }
  }
  const options = { upsert: true }
  await customUserData.updateOne(query, update, options)
  context.user.custom_data.lastLogIn = new Date()
}
