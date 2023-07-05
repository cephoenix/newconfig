// const { asyncedCall } = require('./utils')
const Utils = require('./Utils')

async function init () {
  // await asyncedCall()
  const u = new Utils()
  console.log('DEBUG: ', u)
}

init()
