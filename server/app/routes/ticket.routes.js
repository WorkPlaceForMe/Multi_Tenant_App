const controller = require('../controllers/ticket.controller')
const { authJwt } = require('../middleware')

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Headers', 'x-access-token, Origin, Content-Type, Accept')
    next()
  })
  // app.post
  app.get('/api/ticket/all/', [authJwt.verifyToken, authJwt.isClientOrBranch], controller.getAll)

  app.get(
    '/api/ticket/search/all/',
    [authJwt.verifyToken, authJwt.isClientOrBranch],
    controller.searchAllTickets
  )

  app.get(
    '/api/ticket/alerts/overview/',
    [authJwt.verifyToken, authJwt.isClientOrBranch],
    controller.alertsOverview
  )

  app.post(
    '/api/ticket/counts/',
    [authJwt.verifyToken, authJwt.isClientOrBranch],
    controller.countTypes
  )

  app.post(
    '/api/ticket/some/',
    [authJwt.verifyToken, authJwt.isClientOrBranch],
    controller.getPeriod
  )

  app.put(
    '/api/ticket/check/:id',
    [authJwt.verifyToken, authJwt.isClientOrBranch],
    controller.check
  )

  app.put(
    '/api/ticket/assign/:id',
    [authJwt.verifyToken, authJwt.isClientOrBranch],
    controller.assign
  )
}
