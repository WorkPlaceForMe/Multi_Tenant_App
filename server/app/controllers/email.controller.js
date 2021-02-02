require('dotenv').config({ path: '../../config.env' })
const AWS = require('aws-sdk')
const credentials = new AWS.SharedIniFileCredentials({ profile: 'alex' })
const email = 'alex@graymatics.com'
const email2 = 'i93kaiser@hotmail.com'
AWS.config.update({ region: 'ap-southeast-1' })
AWS.config.credentials = credentials
const ses = new AWS.SES()
const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
  host: 'email-smtp.ap-southeast-1.amazonaws.com',
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: process.env.ACCESSKEYMAIL, // your domain email address
    pass: process.env.SECRETKEYMAIL // your password
  }
})

const mailOptions = {
  from: 'alex@graymatics.com',
  to: 'alex@graymatics.com',
  subject: 'Sending Email using Node.js',
  text: 'That was easy!'
}

exports.getList = async (req, res) => {
  ses.listVerifiedEmailAddresses(function (err, data) {
    if (err) {
      res.status(500).json({ success: false, err: err })
    } else {
      res.status(200).json({ success: true, data: data })
    }
  })
}

exports.sendEm = async (req, res) => {
  transporter.sendMail(req.body, function (error, info) {
    if (error) {
      console.log(error)
      res.status(500).json({ success: false, err: error })
    } else {
      console.log('Email sent: ' + info.response)
      res.status(200).json({ success: false, data: info })
    }
  })
}
