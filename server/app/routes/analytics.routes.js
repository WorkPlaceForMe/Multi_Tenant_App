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

/**
 * @swagger
 * /api/analytics/loitering/{id}:
 *   post:
  *    tags:
  *       - Analytics
  *    summary: "Loitering results"
  *    description: "Use to obtain results from Loitering algorithm for an specific camera under a range of time"
  *    parameters:
  *      - in: path
  *        name: id
  *        schema:
  *          type: string
  *        required: true
  *      - in: header
  *        name: x-access-token
  *        schema:
  *          type: string
  *        required: true
  *    requestBody:
  *       content:
  *          application/json:
  *            schema:
  *              type: object
  *              properties:
  *                type:
  *                  description: "Type of data to be retrieved. Can be cam_id, id_branch or id_account."
  *                  type: string
  *                start:
  *                  description: "Date for initial range. Format: 2020-10-01T03:00:00.000Z."
  *                  type: string
  *                end:
  *                  description: "Date for end range. Format: 2020-10-01T03:00:00.000Z."
  *                  type: string
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

  app.post(
    "/api/analytics/queueLite/:id",
    [authJwt.verifyToken],
    controller.queueLite
  );

  app.post(
    "/api/analytics/pcLite/:id",
    [authJwt.verifyToken],
    controller.pcLite
  );

  app.post(
    "/api/analytics/premises/:id",
    [authJwt.verifyToken],
    controller.premises
  );

  app.post(
    "/api/analytics/threats/:id",
    [authJwt.verifyToken],
    controller.threats
  );

  app.post(
    "/api/analytics/tamper/:id",
    [authJwt.verifyToken],
    controller.tamper
  );
}