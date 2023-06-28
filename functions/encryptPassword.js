/* eslint-disable no-undef */
// eslint-disable-next-line n/no-exports-assign
exports = async function (arg) {
  const salt = 'B374A26A71490437AA024E4FADD5B497'
  const encryptedPassword = utils.crypto.hash('sha1', salt + arg).toHex().toUpperCase()
  return encryptedPassword
}
