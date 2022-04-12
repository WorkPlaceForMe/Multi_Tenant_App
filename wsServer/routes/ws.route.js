const { authJwt, verifySignUp } = require('../middleware')
const controller = require('../controllers/ws.controller')

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Headers', 'x-access-token, Origin, Content-Type, Accept')
    next()
  })

  app.ws(
    '/ws/connect/:id',
    controller.ws
  )
}
