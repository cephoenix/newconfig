// const { asyncedCall } = require('./utils')
const Utils = require('./Utils')

async function init () {
  // await asyncedCall()
  const u = new Utils()
  console.log('DEBUG Sync: ', await u.syncedCall())
  console.log('DEBUG Async: ', await u.asyncedCall())
}

init()
