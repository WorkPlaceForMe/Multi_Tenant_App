const controller = require('../controllers/summarization.controller')
const {authJwt} = require('../middleware')

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Headers', 'x-access-token, Origin, Content-Type, Accept')
    next()
  })

  app.post('/api/video/process', [authJwt.verifyToken], controller.processVideo)
  app.get('/api/video/videoChunk', [authJwt.verifyToken], controller.getOutputVideoStream)
  app.get('/api/video/list', [authJwt.verifyToken], controller.getVideoList)
}
