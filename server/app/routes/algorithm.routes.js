const { authJwt } = require('../middleware')
const controller = require('../controllers/algorithm.controller')

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Headers', 'x-access-token, Origin, Content-Type, Accept')
    next()
  })

  app.get('/api/algorithms/every', [authJwt.verifyToken, authJwt.isAdmin], controller.viewAlgos)

  app.get('/api/algorithms', [authJwt.verifyToken], controller.getAlgos)

  app.put('/api/algorithms/edit/:id', [authJwt.verifyToken, authJwt.isAdmin], controller.updtAlgo)

  app.get('/api/algos', [authJwt.verifyToken], controller.viewAlgos)
  app.get('/api/algo/:id', [authJwt.verifyToken], controller.getAlgoById)
}
