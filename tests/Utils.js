/* eslint-disable no-undef */
// eslint-disable-next-line n/no-exports-assign
exports = class Utils {
  async asyncedCall () {
    console.log('OMG não sincronizado')
  }

  syncedcall () {
    console.log('OMG sincronizado')
  }
}

// module.exports = {
//   asyncedCall,
//   syncedcall
// }

if (typeof module === 'object') {
  module.exports = exports
}
