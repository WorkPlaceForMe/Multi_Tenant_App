const { authJwt } = require('../middleware')
const controller = require('../controllers/helpdesk.controller')

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Headers', 'x-access-token, Origin, Content-Type, Accept')
    next()
  })

  app.post(
    '/api/helpdesk/create',
    [authJwt.verifyToken, authJwt.isUserOrBranch],
    controller.generateNewIssue
  )

  app.get(
    '/api/helpdesk/client',
    [authJwt.verifyToken, authJwt.isClient],
    controller.getHelpDeskIssus
  )

  app.get(
    '/api/helpdesk/userOrBranch',
    [authJwt.verifyToken, authJwt.isUserOrBranch],
    controller.getGeneratedHelpDeskIssus
  )
}
