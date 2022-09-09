const controller = require('../controllers/report.controller')
const { authJwt } = require('../middleware')

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Headers', 'x-access-token, Origin, Content-Type, Accept')
    next()
  })

  app.post('/api/report/:algo_id/:cam_id', [authJwt.verifyToken, authJwt.isClientOrBranch], controller.report)
}
