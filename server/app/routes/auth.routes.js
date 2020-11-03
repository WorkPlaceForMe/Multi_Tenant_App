const { verifySignUp, authJwt } = require("../middleware");
const controller = require("../controllers/auth.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post(
    "/api/auth/signup/client",
    [
      verifySignUp.checkDuplicateUsernameOrEmail,
      verifySignUp.checkAlgosExisted,
      authJwt.verifyToken,
      authJwt.isAdmin
    ],
    controller.signupClient
  );

  app.post(
    "/api/auth/signup/admin",
    [
      verifySignUp.checkDuplicateUsernameOrEmail,
      authJwt.verifyToken,
      authJwt.isAdmin
    ],
    controller.signupAdmin
  );

  app.post(
    "/api/auth/signup/branch",
    [
      verifySignUp.checkDuplicateUsernameOrEmail,
      authJwt.verifyToken,
      authJwt.isClient
    ],
    controller.signupBranch
  );

  app.post(
    "/api/auth/signup/user",
    [
      verifySignUp.checkDuplicateUsernameOrEmail,
      authJwt.verifyToken,
      authJwt.isClientOrBranch
    ],
    controller.signupUser
  );

  app.post("/api/auth/signin", controller.signin);

  app.get(
    "/api/auth/check",
    [
      authJwt.verifyToken
    ],
    controller.check
  );
};