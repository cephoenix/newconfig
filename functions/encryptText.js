/* eslint-disable no-undef */
// eslint-disable-next-line n/no-exports-assign
exports = async function (text) {
  const key = context.values.get('encryptionKey')
  const textToChars = (text) => text.split('').map((c) => c.charCodeAt(0))
  const byteHex = (n) => ('0' + Number(n).toString(16)).substr(-2)
  const applySaltToChar = (code) => textToChars(key).reduce((a, b) => a ^ b, code)

  let ret = text
    .split('')
    .map(textToChars)
    .map(applySaltToChar)
    .map(byteHex)
    .join('')
  ret = Buffer.from(ret).toString('base64')
  return ret
}

if (typeof module === 'object') {
  module.exports = exports
}
