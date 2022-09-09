const controller = require('../controllers/heatmap.controller')
const { authJwt } = require('../middleware')

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      'Access-Control-Allow-Headers',
      'x-access-token, Origin, Content-Type, Accept'
    )
    next()
  })

  app.get(
    '/api/heatmap/all/:id',
    [authJwt.verifyToken, authJwt.isClientOrBranch],
    controller.getAllHm
  )

  app.get(
    '/api/heatmap/test/',
    [authJwt.verifyToken, authJwt.isClientOrBranch],
    controller.test
  )

  app.get(
    '/api/heatmap/date/:st/:end/:id',
    [authJwt.verifyToken, authJwt.isClientOrBranch],
    controller.getHm
  )
}
