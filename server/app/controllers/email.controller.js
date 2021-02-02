require('dotenv').config({ path: '../../config.env' })
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

exports.sendEm = async (req, res) => {
  transporter.sendMail(req.body, function (error, info) {
    if (error) {
      console.log(error)
      res.status(500).json({ success: false, err: error })
    } else {
      res.status(200).json({ success: true, data: info })
    }
  })
}
