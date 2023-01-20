const CryptoJS = require('crypto-js')
require('dotenv').config({ path: '../../../config.env' })

const check = (req, res, next) => {
    const token = req.headers['proxy']
    if (!token) {
        return res.status(403).send({
          message: 'No password provided!'
        })
    }

    const key = CryptoJS.enc.Utf8.parse(process.env.SECRETAPIPROXY);
    const iv  = CryptoJS.enc.Utf8.parse(process.env.ENCRYPTIONIV);
    const data = CryptoJS.AES.decrypt(token, key, { iv: iv });
    const comparison = data.toString(CryptoJS.enc.Utf8);

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