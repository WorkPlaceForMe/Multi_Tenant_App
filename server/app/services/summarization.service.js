require('dotenv').config({
  path: '../../../config.env'
})
const axios = require('axios')

exports.getProgressData = async (clientId, inputFilePath) => {
  let queryString = ''
  let url = process.env.SUMMARIZATION_SERVER + '/api/video/list'

  if (clientId) {
    queryString += 'clientId=' + clientId + '&'
  }

  if (inputFilePath) {
    queryString += 'inputFilePath=' + inputFilePath + '&'
  }

  if (queryString) {
    url += '?' + queryString
  }

  return axios.get(url)
}
