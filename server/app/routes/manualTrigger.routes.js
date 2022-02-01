const {authJwt} = require('../middleware')
const controller = require('../controllers/manualTrigger.controller')

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Headers', 'x-access-token, Origin, Content-Type, Accept')
    next()
  })

  app.post(
    '/api/manualTrigger/snapshot',
    [authJwt.verifyToken, authJwt.isClient],
    controller.saveSnapshot
  )

  app.post(
    '/api/manualTrigger/create',
    [authJwt.verifyToken, authJwt.isClient],
    controller.createManualTrigger
  )
}
