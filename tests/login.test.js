/* eslint-disable no-undef */
const { loginSuccess, loginFail, loginIncorrectPassword } = require('./login')

test('Teste de sucesso no login', async () => {
  expect(await loginSuccess()).toBe(true)
})

test('Teste de falha no login', async () => {
  expect(await loginFail()).toBe(false)
})

test('Teste de Senha incorreta', async () => {
  expect(await loginIncorrectPassword()).toBe('Senha ou usuário incorretos!')
})
