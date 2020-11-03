const { authJwt } = require("../middleware");
const controller = require("../controllers/image.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get(
    "/api/image/:uuid",
    [authJwt.verifyToken, authJwt.isClientOrBranch],
    controller.readImgs
  );

  app.post(
    "/api/image/:uuid",
    [authJwt.verifyToken, authJwt.isClientOrBranch],
    controller.imageUp
  );

  app.post(
    "/api/image",
    [authJwt.verifyToken, authJwt.isClientOrBranch],
    controller.delImg
  );
};