/* eslint-disable no-undef */
// eslint-disable-next-line n/no-exports-assign
exports = class utils {
  // constructor() {

  // }

  async asyncedCall () {
    console.log('OMG não sincronizado')
  }

  syncedcall () {
    console.log('OMG sincronizado')
  }
}

if (typeof module === 'object') {
  module.exports = exports
}
