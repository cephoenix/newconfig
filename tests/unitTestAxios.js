// import Realm from 'realm'
const axios = require('axios')
// const UtilsLib = require('./utils.js')
// const utils = new UtilsLib()

init()

async function init () {
  const loginResponse = await testLogin()
  expect(loginResponse.data.success).toBe(true)
  // await testEncryption()
  // await testAxios()
  // await utils.syncedcall()
}

async function testLogin () {
  const url = 'https://sa-east-1.aws.data.mongodb-api.com/app/application-0-xrtcd/endpoint/login?action=doLogin'
  const data = {
    login: 'carlosemilio',
    encryptedPassword: 'YTlhYWFiYWNhZGFlYWZhMA=='
  }
  const config = {
    headers: {
      'Content-Type': ['application/json'],
      authorizationKey: '0b6336226cbe51d8b47e2f04b70de602'
    }
  }

  const resp = await axios.post(url, data, config)
  console.log('RESP ', resp)
}

async function testEncryption () {
  const encryptText = require('../functions/encryptText.js')
  const et = encryptText('12345678')
  console.log('ET: ', et)
}

async function testAxios () {
  const url = 'https://app.firebee.com.br/api/1.1/obj/Products/'
  const data = {}
  const config = {
    headers: {
      'Content-Type': ['application/json'],
      Authorization: 'Bearer 0b6336226cbe51d8b47e2f04b70de602'
    }
  }
  const resp = await axios.get(url, data, config)
  const test = await resp.data.response.results

  test.forEach(element => console.log(element))
}
