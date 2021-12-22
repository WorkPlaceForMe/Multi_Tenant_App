const controller = require('../controllers/path.controller')
const { authJwt } = require('../middleware')

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Headers', 'x-access-token, Origin, Content-Type, Accept')
    next()
  })

  app.get(
    '/api/path/all/:id',
    [authJwt.verifyToken, authJwt.isClientOrBranch],
    controller.getAllPath
  )

  app.get(
    '/api/path/date/:st/:end/:id',
    [authJwt.verifyToken, authJwt.isClientOrBranch],
    controller.getPath
  )
}
