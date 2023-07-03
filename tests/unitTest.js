// import Realm from 'realm'
const Realm = require('realm')

// const test = require('../functions/testsControl.js')

const credentials = Realm.Credentials.apiKey('VRxu9sw1XokC8QZxbeNPiQujBzPuW4BKmGKXdaSfIMk4fG5iOalTp4Q6Y8Xx3FxX')

async function login () {
  let app
  try {
    app = new Realm.App({ id: 'application-0-xrtcd' })
  } catch (error) {
    console.error('Erro ao abrir APP:', error)
  }
  console.log('APP: ', app)

  let user
  try {
    user = await app.logIn(credentials)
  } catch (error) {
    console.error('Erro ao autenticar usuário:', error)
  }

  console.log('Usuário autenticado:', user)
  const functions = user.functions

  console.log('Debug: ', functions)
  let result
  try {
    result = await functions.encryptText('YTlhYWFiYWNhZGFlYWZhMA==')
  } catch (error) {
    console.error('Erro ao executar função:', error)
  }

  console.log('Resultados: ', result)
}

async function init () {
  try {
    await login()
    // // Obtém o cliente do banco de dados remoto
    // const mongodb = app.getServiceClient(RemoteMongoClient.factory, 'mongodb-atlas')
    // const users = mongodb.db('configRadio').collection('users')
    // const doc = await users.findOne({ _id: '649c88e94c067236c8081adc' })
    // console.log(`DEBUG: ${doc}`)
  } catch (error) {
    throw new Error('Problema ao realizar login')
  }
}

init()
