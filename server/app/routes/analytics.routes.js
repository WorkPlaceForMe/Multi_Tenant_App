const controller = require("../controllers/analytics.controller");
const { authJwt } = require("../middleware");


module.exports = function(app) {
   app.use(function(req, res, next) {
     res.header(
       "Access-Control-Allow-Headers",
       "x-access-token, Origin, Content-Type, Accept"
     );
     next();
   });

   app.post(
    "/api/analytics/loitering/:id",
    [authJwt.verifyToken],
    controller.loitering
  );

  app.post(
    "/api/analytics/intrude/:id",
    [authJwt.verifyToken],
    controller.intrude
  );

  app.post(
    "/api/analytics/violence/:id",
    [authJwt.verifyToken],
    controller.violence
  );

  app.post(
    "/api/analytics/aod/:id",
    [authJwt.verifyToken],
    controller.aod
  );

  app.post(
    "/api/analytics/covered/:id",
    [authJwt.verifyToken],
    controller.covered
  );

  app.post(
    "/api/analytics/social/:id",
    [authJwt.verifyToken],
    controller.social
  );

  app.post(
    "/api/analytics/pc/:id",
    [authJwt.verifyToken],
    controller.pc
  );

  app.post(
    "/api/analytics/helm/:id",
    [authJwt.verifyToken],
    controller.helm
  );

  app.post(
    "/api/analytics/queue/:id",
    [authJwt.verifyToken],
    controller.queue
  );

  app.post(
    "/api/analytics/vault/:id",
    [authJwt.verifyToken],
    controller.vault
  );

  app.post(
    "/api/analytics/parking/:id",
    [authJwt.verifyToken],
    controller.parking
  );

  app.post(
    "/api/analytics/anpr/:id",
    [authJwt.verifyToken],
    controller.anpr
  );

  app.post(
    "/api/analytics/barrier/:id",
    [authJwt.verifyToken],
    controller.barrier
  );

  app.post(
    "/api/analytics/vehicle/:id",
    [authJwt.verifyToken],
    controller.vc
  );
}