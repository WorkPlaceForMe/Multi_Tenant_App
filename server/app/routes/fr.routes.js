const controller = require('../controllers/fr.controller')
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
    '/api/fr/viewAll',
    [authJwt.verifyToken, authJwt.isClientOrBranch],
    controller.viewUsers
  )

  app.get(
    '/api/fr/viewOne/:uuid',
    [authJwt.verifyToken, authJwt.isClientOrBranch],
    controller.viewUser
  )

  app.put(
    '/api/fr/edit',
    [authJwt.verifyToken, authJwt.isClientOrBranch],
    controller.editUser
  )

  app.delete(
    '/api/fr/delete/:uuid',
    [authJwt.verifyToken, authJwt.isClientOrBranch],
    controller.deleteUser
  )

  app.post(
    '/api/fr',
    [authJwt.verifyToken, authJwt.isClientOrBranch],
    controller.addFr
  )
}
