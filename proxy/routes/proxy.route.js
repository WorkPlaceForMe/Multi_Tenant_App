const { verifyIn, verify } = require('../middleware')
const controller = require('../controllers/proxy.controller')

module.exports = function (app, v) {
  app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Headers', 'x-access-token, Origin, Content-Type, Accept')
    next()
  })

  app.post(
    `/api/${v}/r`,
    [],
    controller.retrieve
  )

  app.put(
    `/api/${v}/u`,
    [],
    controller.update
  )

  app.post(
    `/api/${v}/i`,
    [verifyIn.values],
    controller.insert
  )
}
