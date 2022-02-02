const {authJwt} = require('../middleware')
const controller = require('../controllers/reply.controller')

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Headers', 'x-access-token, Origin, Content-Type, Accept')
    next()
  })

  app.post(
    '/api/helpdeskReply/:id',
    [authJwt.verifyToken, authJwt.isClientOrUserOrBranch],
    controller.postReply
  )

  app.put(
    '/api/helpdeskReply/:id',
    [authJwt.verifyToken, authJwt.isClientOrUserOrBranch],
    controller.updateStatus
  )

  app.get(
    '/api/helpdeskReply/:id',
    [authJwt.verifyToken, authJwt.isClientOrUserOrBranch],
    controller.getReplies
  )
}
