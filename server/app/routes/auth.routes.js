const { verifySignUp, authJwt } = require("../middleware");
const controller = require("../controllers/auth.controller");

  /**
  * @swagger
  *tags:
  *  name: Account
  *  description: API to manage accounts settings.
  */


 /**
 *@swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - title
 *         - author
 *         - finished
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated id of the book.
 *         title:
 *           type: string
 *           description: The title of your book.
 *         author:
 *           type: string
 *           description: Who wrote the book?
 *         finished:
 *           type: boolean
 *           description: Have you finished reading it?
 *         createdAt:
 *           type: string
 *           format: date
 *           description: The date of the record creation.
 *       example:
 *          title: The Pragmatic Programmer
 *          author: Andy Hunt / Dave Thomas
 *          finished: true
*/
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

  /**
  * @swagger
  * /api/auth/signin:
  *   post:
  *    tags:
  *       - Account
  *    summary: "Log In"
  *    description: "Use to log in using username and password. This method returns the token to be used on every other requests with a length of 12 hours."
  *    requestBody:
  *       content:
  *          application/json:
  *            schema:
  *              type: object
  *              properties:
  *                username:
  *                  description: "Username"
  *                  type: string
  *                  example: test
  *                password:
  *                  description: "Password"
  *                  type: string
  *                  example: test
  *    responses:
  *      '200':
  *        description: "A successful response"
  *      '404':
  *        description: "Not found"
  *      '403':
  *        description: "No token provided"
  *      '500':
  *        description: "Server error"
 */
  app.post("/api/auth/signin", controller.signin);

  app.post("/api/auth/signout", controller.loggOut);

  app.get(
    "/api/auth/check",
    [
      authJwt.verifyToken
    ],
    controller.check
  );
};