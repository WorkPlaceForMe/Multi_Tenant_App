require('dotenv').config({ path: 'config.env' })
const axios = require('axios')
const si = require('systeminformation')
const crypt = require('crypto-js')
const fs = require('fs')

exports.send = async () => {
  return new Promise((resolve, reject) => {
    si.getStaticData()
      .then(async data => {
        const phrase = `${process.env.SERIAL}/|${data.uuid.os}/|${data.uuid.hardware}/|${data.os.hostname}/|${data.diskLayout[0].size}/|${data.versions.kernel}/|${data.system.model}/|${data.version}/|${data.diskLayout[0].serialNum}`
        const encrypted = crypt.AES.encrypt(phrase, process.env.SECRETLOCAL).toString()
        const file = './resources/.key.scrt'
        let result
        if (fs.existsSync(file)) {
          console.log('Reading serial key...')
          try {
            const data = await fs.readFileSync(file, 'utf8')
            const bytes = crypt.AES.decrypt(data, process.env.SECRETLOCAL)
            const comparison = bytes.toString(crypt.enc.Utf8)

            if (phrase !== comparison) {
              result = "Unsuccessful read: Serial don't match with the present one."
              console.log(result)
              // eslint-disable-next-line prefer-promise-reject-errors
              return reject(false)
            } else {
              result = 'Successfully read: Serial matched.'
              console.log(result)
              return resolve(true)
            }
          } catch (err) {
            console.error(err)
            // eslint-disable-next-line prefer-promise-reject-errors
            return reject(false)
          }
        }

        try {
          const response = await axios.post(`http://${process.env.SERIALAPI}/api/v1/serial`, {
            snd: encrypted
          })
          const bytes = crypt.AES.decrypt(response.data.auth, process.env.SECRETLOCAL)
          let comparison = bytes.toString(crypt.enc.Utf8)
          if (comparison === 'true') {
            comparison = true
            console.log('Writting serial key...')
            try {
              await fs.promises.writeFile(file, encrypted, 'utf8')
              await fs.promises.chmod(file, 0o400)
              result = 'Successfully wrote: Serial saved.'
              console.log(result)
              return resolve(true)
            } catch (err) {
              console.error(err)
              // eslint-disable-next-line prefer-promise-reject-errors
              return reject(false)
            }
          } else {
            comparison = false
          }
          return resolve(comparison)
        } catch (err) {
          return reject(err)
        }
      })
      .catch(error => {
        console.error(error)
        return reject(error)
      })
  })
}
