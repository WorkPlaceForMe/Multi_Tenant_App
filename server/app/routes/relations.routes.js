const controller = require("../controllers/relations.controller");
const { authJwt, verifyRel } = require("../middleware");


module.exports = function(app) {
   app.use(function(req, res, next) {
     res.header(
       "Access-Control-Allow-Headers",
       "x-access-token, Origin, Content-Type, Accept"
     );
     next();
   });

   app.get(
    "/api/relations/cam/:id",
    [authJwt.verifyToken, authJwt.isClientOrBranch],
    controller.getRels
  );

  app.get(
    "/api/relations/dashboards",
    [authJwt.verifyToken, authJwt.isClientOrBranch],
    controller.dashboards
  );

  app.get(
    "/api/relations/all",
    [authJwt.verifyToken],
    controller.getAll
  );

  app.post(
    "/api/relations/create",
    [authJwt.verifyToken, authJwt.isClientOrBranch, verifyRel.numRels],
    controller.createRel
  );

  app.delete(
    "/api/relations/del/:id",
    [authJwt.verifyToken, authJwt.isClientOrBranch],
    controller.deleteRel
  );

  app.put(
    "/api/relations/edit/:id",
    [authJwt.verifyToken, authJwt.isClientOrBranch],
    controller.editRel
  );

  app.post(
    "/api/camConf/:id",
    [authJwt.verifyToken, authJwt.isClientOrBranch, verifyRel.numRels],
    controller.configs
  );

  app.post(
    "/api/roiConf/:id",
    [authJwt.verifyToken, authJwt.isClientOrBranch],
    controller.configsRoi
  );

  app.get(
    "/api/relations/check/:id/:cam",
    [authJwt.verifyToken],
    controller.checkVideo
  );
}