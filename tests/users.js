const axios = require('axios')

async function findOneSuccess () {
  const url = 'https://sa-east-1.aws.data.mongodb-api.com/app/application-0-xrtcd/endpoint/users?action=findOne'
  const data = {
    login: 'carlosemilio'
  }
  const config = {
    headers: {
      'Content-Type': ['application/json'],
      authorizationKey: '0b6336226cbe51d8b47e2f04b70de602'
    }
  }

  const resp = await axios.post(url, data, config)
  return resp.data.success
}

module.exports = {
  findOneSuccess
}
