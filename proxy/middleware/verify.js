const crypt = require('crypto-js')
require('dotenv').config({ path: '../../../config.env' })

const check = (req, res, next) => {
    const token = req.headers['proxy']
    if (!token) {
        return res.status(403).send({
          message: 'No password provided!'
        })
      }

    const bytes  = crypt.AES.decrypt(token, process.env.SECRETAPIPROXY);

    //================================

    const comparison = bytes.toString(crypt.enc.Utf8);

    //Ask Ranjit to help me in this area. ==================

    console.log(comparison)

    if(comparison !== process.env.PASSAPIPROXY){
        return res.status(401).send({
            message: 'Unauthorized!'
        })
    }else if(comparison === process.env.PASSAPIPROXY){
        next()
    }
}

const verify = {
    check: check
  }
  
module.exports = verify