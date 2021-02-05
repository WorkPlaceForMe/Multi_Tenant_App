const { verifySignUp, authJwt } = require('../middleware')
const controller = require('../controllers/auth.controller')

/**
 * @swagger
 *tags:
 *  name: Account
 *  description: API to manage accounts settings.
 */

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Headers', 'x-access-token, Origin, Content-Type, Accept')
    next()
  })

  app.post(
    '/api/auth/signup/client',
    [
      verifySignUp.checkDuplicateUsernameOrEmail,
      verifySignUp.checkAlgosExisted,
      authJwt.verifyToken,
      authJwt.isAdmin
    ],
    controller.signupClient
  )

  app.post(
    '/api/auth/signup/admin',
    [verifySignUp.checkDuplicateUsernameOrEmail, authJwt.verifyToken, authJwt.isAdmin],
    controller.signupAdmin
  )

  app.post(
    '/api/auth/signup/branch',
    [verifySignUp.checkDuplicateUsernameOrEmail, authJwt.verifyToken, authJwt.isClient],
    controller.signupBranch
  )

  app.post(
    '/api/auth/signup/user',
    [verifySignUp.checkDuplicateUsernameOrEmail, authJwt.verifyToken, authJwt.isClientOrBranch],
    controller.signupUser
  )

  /**
   * @swagger
   * /api/auth/signin:
   *   post:
   *    tags:
   *       - Account
   *    summary: "Log In"
   *    operationId: signin
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
   *       '200':
   *         description: "A successful response"
   *         content:
   *           application/json:
   *             schema:
   *              type: object
   *              properties:
   *                success:
   *                  description: "Result type"
   *                  type: boolean
   *                  example: true
   *                user:
   *                  type: object
   *                  properties:
   *                    id:
   *                      description: "Id"
   *                      type: string
   *                      example: 3333-666666-cccccc-nnnnnn
   *                    username:
   *                      description: "Username"
   *                      type: string
   *                      example: test
   *                    email:
   *                      description: "Email"
   *                      type: string
   *                      example: test@graymatics.com
   *                    role:
   *                      description: "Role"
   *                      type: string
   *                      example: client
   *                    id_account:
   *                      description: "Id associated with the general account"
   *                      type: string
   *                      example: 3333-666666-cccccc-nnnnnn
   *                    id_branch:
   *                      description: "Id associated with the branch account"
   *                      type: string
   *                      example: "0000"
   *                    cameras:
   *                      description: "Cameras available for the user"
   *                      type: boolean
   *                      example: 10
   *                    analytics:
   *                      description: "Analytics available for the user"
   *                      type: boolean
   *                      example: 10
   *                    token:
   *                      description: "Security Token"
   *                      type: string
   *                      example: eyJhbGciOiJIUzI1NiIsIiOjE2MTA2NDAwODUsImV4cCI6MTYxM...Zl3afmPKKIMytQtLRDR0k13PQ
   *       '404':
   *         description: "Not found"
   *         content:
   *           application/json:
   *             schema:
   *              type: object
   *              properties:
   *                success:
   *                  description: "Result type"
   *                  type: boolean
   *                  example: false
   *                message:
   *                  description: "Type of failure"
   *                  type: string
   *                  example: "User is not in the records"
   *                type:
   *                  description: "Error type"
   *                  type: string
   *                  example: user
   *       '401':
   *         description: "User disabled"
   *         content:
   *           application/json:
   *             schema:
   *              type: object
   *              properties:
   *                success:
   *                  description: "Result type"
   *                  type: boolean
   *                  example: false
   *                message:
   *                  description: "Type of failure"
   *                  type: string
   *                  example: "This account has been disabled, please get in contact with the Administator."
   *                type:
   *                  description: "Error type"
   *                  type: string
   *                  example: disable
   *       '400':
   *         description: "Invalid Password"
   *         content:
   *           application/json:
   *             schema:
   *              type: object
   *              properties:
   *                success:
   *                  description: "Result type"
   *                  type: boolean
   *                  example: false
   *                message:
   *                  description: "Type of failure"
   *                  type: string
   *                  example: "Invalid Password"
   *                type:
   *                  description: "Error type"
   *                  type: string
   *                  example: password
   *       '500':
   *         description: "Server error"
   *         content:
   *           application/json:
   *             schema:
   *              type: object
   *              properties:
   *                success:
   *                  description: "Result type"
   *                  type: boolean
   *                  example: false
   *                message:
   *                  description: "Type of failure"
   *                  type: string
   *                  example: Error message generated by the server
   */
  app.post('/api/auth/signin', controller.signin)

  app.post('/api/auth/signout', controller.loggOut)

  app.get('/api/auth/check', [authJwt.verifyToken], controller.check)
}
