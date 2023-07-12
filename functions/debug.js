/* eslint-disable no-undef */
// eslint-disable-next-line n/no-exports-assign
exports = function ({ query, headers, body }, response) {
  console.log('USER: ', JSON.stringify(context.user))
  return context.user
}
