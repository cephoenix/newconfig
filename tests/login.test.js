/* eslint-disable no-undef */
const { loginSuccess, loginFail } = require('./login')

test('Teste de sucesso no login', async () => {
  expect(await loginSuccess()).toBe(true)
})

test('Teste de falha no login', async () => {
  expect(await loginFail()).toBe(false)
})
