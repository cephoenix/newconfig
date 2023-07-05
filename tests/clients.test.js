/* eslint-disable no-undef */
const { findOneSuccess } = require('./clients')

test('Teste de sucesso ao buscar um Cliente', async () => {
  expect(await findOneSuccess()).toBe(true)
})
