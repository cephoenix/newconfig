/* eslint-disable no-undef */
// eslint-disable-next-line n/no-exports-assign
exports = class Utils {
  async asyncedCall () {
    return 'OMG não sincronizado'
  }

  syncedCall () {
    return 'OMG sincronizado'
  }
}

// module.exports = {
//   asyncedCall,
//   syncedcall
// }

if (typeof module === 'object') {
  module.exports = exports
}
