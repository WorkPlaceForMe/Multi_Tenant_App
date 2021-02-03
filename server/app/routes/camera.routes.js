const { authJwt, verifyCam } = require("../middleware");
const controller = require("../controllers/camera.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post(
    "/api/camera",
    [authJwt.verifyToken, authJwt.isClientOrBranch, verifyCam.rtsp, verifyCam.numCams],
    controller.addCamera
  );

  app.get(
    "/api/camera/viewAll",
    [authJwt.verifyToken],
    controller.viewCams
  );

  app.get(
    "/api/camera/viewLiveCams",
    [authJwt.verifyToken],
    controller.viewLiveCams
  );

  app.get(
    "/api/camera/viewOne/:id",
    [authJwt.verifyToken, authJwt.isClientOrBranch],
    controller.viewCam
  );

  app.put(
    "/api/camera/edit/:id",
    [authJwt.verifyToken, authJwt.isClientOrBranch],
    controller.editCam
  );

  app.delete(
    "/api/camera/delete/:id",
    [authJwt.verifyToken, authJwt.isClientOrBranch],
    controller.delCam
  );

  app.post(
    "/api/cameraImages/",
    [authJwt.verifyToken, authJwt.isClientOrBranch],
    controller.addAtr
  );

  app.post(
    "/api/camera/play",
    [authJwt.verifyToken],
    controller.cam
  );

  app.post(
    "/api/camera/stop",
    [authJwt.verifyToken],
    controller.stopCam
  );

  app.post(
    "/api/camera/checkRel",
    [authJwt.verifyToken],
    controller.checkCamRel
  );
}