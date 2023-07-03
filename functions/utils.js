/* eslint-disable no-undef */
// eslint-disable-next-line n/no-exports-assign
class utils {
  static async asyncedCall () {
    console.log('Async')
  }

  static syncedcall () {
    console.log('Sync')
  }
}

if (typeof module === 'object') {
  module.exports = exports
}
