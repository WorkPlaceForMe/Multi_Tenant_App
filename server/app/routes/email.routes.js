const controller = require('../controllers/email.controller')

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Headers', 'x-access-token, Origin, Content-Type, Accept')
    next()
  })

  /**
   * @swagger
   *tags:
   *  name: Email
   *  description: API to send email.
   */

  app.post('/api/mail/send', [], controller.sendEm)
}
