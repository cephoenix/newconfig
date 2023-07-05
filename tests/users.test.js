/* eslint-disable no-undef */
const { findOneSuccess } = require('./users')

test('Teste de sucesso ao buscar um Usuário', async () => {
  expect(await findOneSuccess()).toBe(true)
})
