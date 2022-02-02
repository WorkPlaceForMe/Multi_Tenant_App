const {authJwt} = require('../middleware')
const controller = require('../controllers/incident.controller')

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Headers', 'x-access-token, Origin, Content-Type, Accept')
    next()
  })

  app.post(
    '/api/incident/create',
    [authJwt.verifyToken, authJwt.isClientOrUserOrBranch],
    controller.addIncident
  )

  app.post(
    '/api/incident/memo/:id',
    [authJwt.verifyToken, authJwt.isClientOrUserOrBranch],
    controller.addMemo
  )

  app.get(
    '/api/incident/details/:id',
    [authJwt.verifyToken, authJwt.isClientOrUserOrBranch],
    controller.incidentDetails
  )

  app.post(
    '/api/incident/bookmark/:id',
    [authJwt.verifyToken, authJwt.isClientOrUserOrBranch],
    controller.manageBookmark
  )

  app.get('/api/incident/logs', [authJwt.verifyToken, authJwt.isClient], controller.incidentLogs)

  app.post('/api/incident/timeline', [authJwt.verifyToken, authJwt.isClient], controller.incidentsWithTimeline)
}
