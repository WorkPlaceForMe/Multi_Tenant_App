require('dotenv').config({ path: 'config.env' })
const axios = require('axios')
const si = require('systeminformation')
const crypt = require('crypto-js')

exports.send = async () => {
  return new Promise((resolve, reject) => {
    si.getStaticData()
      .then(async data => {
        const phrase = `${process.env.SERIAL}/|${data.uuid.os}/|${data.uuid.hardware}/|${data.os.hostname}/|${data.diskLayout[0].size}/|${data.versions.kernel}/|${data.system.model}/|${data.version}/|${data.diskLayout[0].serialNum}`
        const encrypted = crypt.AES.encrypt(phrase, process.env.SECRETLOCAL).toString()
          try {
              const response = await axios.post(`http://${process.env.SERIALAPI}/api/v1/serial`, {
                snd: encrypted
              })
              const bytes = crypt.AES.decrypt(response.data.auth, process.env.SECRETLOCAL)
              let comparison = bytes.toString(crypt.enc.Utf8)
              if (comparison === 'true') {
                comparison = true
              } else {
                comparison = false
              }
              resolve(comparison)
            } catch (err) {
              reject(err)
            }
      })
    .catch(error => {
        console.error(error)
        reject(error)
    })
  })
}