/* eslint-disable no-undef */
// eslint-disable-next-line n/no-exports-assign
exports = class utils {
  static async asyncedCall () {
    return 'Async'
  }

  static syncedCall () {
    return 'Sync'
  }
}

if (typeof module === 'object') {
  module.exports = exports
}
