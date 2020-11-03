const { authJwt, verifySignUp } = require("../middleware");
const controller = require("../controllers/user.controller");
const { verifyToken } = require("../middleware/authJwt");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get(
    "/api/users/remaining",
    [authJwt.verifyToken, authJwt.isClientOrBranch],
    controller.remaining
  );

  app.get(
    "/api/users/getOneAd/:uuid",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.viewOneAd
  );

  app.get(
    "/api/users/getOne/:uuid",
    [authJwt.verifyToken, authJwt.isClientOrBranchOrAdmin],
    controller.viewOne
  );


  app.get(
    "/api/users/client",
    [authJwt.verifyToken, authJwt.isClient],
    controller.viewClientUnder
  );

  app.get(
    "/api/users/branch",
    [authJwt.verifyToken, authJwt.isClientOrBranch],
    controller.viewBranchUnder
  );

  app.get(
    "/api/users/admin",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.viewAdminUnder
  );

  app.put(
    "/api/edit/branch/:uuid",
    [authJwt.verifyToken, authJwt.isClient, verifySignUp.checkDuplicateUsernameOrEmailEdit],
    controller.editBranch
  );

  app.put(
    "/api/edit/user/:uuid",
    [authJwt.verifyToken, authJwt.isClientOrBranch, verifySignUp.checkDuplicateUsernameOrEmailEdit],
    controller.editUser
  );

  app.put(
    "/api/edit/client/:uuid",
    [authJwt.verifyToken, authJwt.isAdmin, verifySignUp.checkDuplicateUsernameOrEmailEdit],
    controller.editClient
  );

  app.put(
    "/api/edit/admin/:uuid",
    [authJwt.verifyToken, authJwt.isAdmin, verifySignUp.checkDuplicateUsernameOrEmailEdit],
    controller.editAdmin
  );

  app.delete(
    "/api/delete/user/:uuid",
    [authJwt.verifyToken, authJwt.isClientOrBranch],
    controller.deleteUser
  );

  app.delete(
    "/api/delete/branch/:uuid",
    [authJwt.verifyToken, authJwt.isClient],
    controller.deleteBranch
  );

  app.delete(
    "/api/delete/client/:uuid",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.deleteClient
  );

  app.delete(
    "/api/delete/admin/:uuid",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.deleteAdmin
  );

  app.put(
    "/api/changeP/:uuid",
    [authJwt.verifyToken, authJwt.isClientOrBranchOrAdmin],
    controller.changePass
  );
};