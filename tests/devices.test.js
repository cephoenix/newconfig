/* eslint-disable no-undef */
const { findOneSuccess } = require('./devices')

test('Teste de sucesso ao buscar um Dispositivo', async () => {
  expect(await findOneSuccess()).toBe(true)
})
