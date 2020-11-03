const { authJwt } = require("../middleware");
const controller = require("../controllers/schedule.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get(
    "/api/schedule/all",
    [
      authJwt.verifyToken,
      authJwt.isClientOrBranch
    ],
    controller.getSched
  );

  app.post(
    "/api/schedule/create",
    [
      authJwt.verifyToken,
      authJwt.isClientOrBranch
    ],
    controller.createSched
  );

  app.delete(
    "/api/schedule/del/:id",
    [
      authJwt.verifyToken,
      authJwt.isClientOrBranch
    ],
    controller.deleteSched
  );

  app.put(
    "/api/schedule/edit/:id",
    [
      authJwt.verifyToken,
      authJwt.isClientOrBranch
    ],
    controller.editSched
  );
};