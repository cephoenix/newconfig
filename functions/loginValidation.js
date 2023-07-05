/* eslint-disable no-undef */
// eslint-disable-next-line n/no-exports-assign
exports = async function (data) {
  const action = data.urlParameters.action
  const parameters = data.body

  switch (action) {
    case 'doLogin':
      await validateDoLogin(parameters)
      break

    case 'testLogin':
      await validateTestLogin(parameters)
      break

    default:
      if (!action) {
        throw new Error('Nenhuma ação informada!')
      } else {
        throw new Error(`Ação (${action}) inválida!`)
      }
  }
}

async function validateDoLogin (parameters) {
}

async function validateTestLogin (parameters) {

}

if (typeof module === 'object') {
  module.exports = exports
}
