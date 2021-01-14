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
  *tags:
  *  name: Analytics
  *  description: API to manage the analytics returns.
  */
   /**
  * @swagger
  *tags:
  *  name: Overview Dashboard
  *  description: API to manage the overview dashboard results.
  */


/**
  * @swagger
  * /api/analytics/loitering/{id}:
  *   post:
  *    tags:
  *       - Analytics
  *    summary: "Loitering analytic's results"
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
  *                  example: cam_id
  *                start:
  *                  description: "Date for initial range. Format: 2020-10-01T03:00:00.000Z."
  *                  type: string
  *                  example: 2020-10-01T03:00:00.000Z
  *                end:
  *                  description: "Date for end range. Format: 2020-10-01T03:00:00.000Z."
  *                  type: string
  *                  example: 2020-11-01T02:59:59.000Z
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

  app.get(
    "/api/analytics/loitering/alerts",
    [authJwt.verifyToken],
    controller.loiteringAlerts
  );

  app.get(
    "/api/analytics/loitering/alerts/:id",
    [authJwt.verifyToken],
    controller.loiteringAlerts
  );

/**
  * @swagger
  * /api/analytics/intrude/{id}:
  *   post:
  *    tags:
  *       - Analytics
  *    summary: "Intrusion Alert results"
  *    description: "Use to obtain results from Intrusion Alert algorithm for an specific camera under a range of time"
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
  *                  example: cam_id
  *                start:
  *                  description: "Date for initial range. Format: 2020-10-01T03:00:00.000Z."
  *                  type: string
  *                  example: 2020-10-01T03:00:00.000Z
  *                end:
  *                  description: "Date for end range. Format: 2020-10-01T03:00:00.000Z."
  *                  type: string
  *                  example: 2020-11-01T02:59:59.000Z
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
    "/api/analytics/intrude/:id",
    [authJwt.verifyToken],
    controller.intrude
  );

  app.get(
    "/api/analytics/intrude/alerts",
    [authJwt.verifyToken],
    controller.intrudeAlerts
  );

  /**
  * @swagger
  * /api/analytics/violence/{id}:
  *   post:
  *    tags:
  *       - Analytics
  *    summary: "Violence algorithm's results"
  *    description: "Use to obtain results from Violence algorithm for an specific camera under a range of time"
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
  *                  example: cam_id
  *                start:
  *                  description: "Date for initial range. Format: 2020-10-01T03:00:00.000Z."
  *                  type: string
  *                  example: 2020-10-01T03:00:00.000Z
  *                end:
  *                  description: "Date for end range. Format: 2020-10-01T03:00:00.000Z."
  *                  type: string
  *                  example: 2020-11-01T02:59:59.000Z
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
    "/api/analytics/violence/:id",
    [authJwt.verifyToken],
    controller.violence
  );

  /**
  * @swagger
  * /api/analytics/aod/{id}:
  *   post:
  *    tags:
  *       - Analytics
  *    summary: "Abandoned Object analytic's results"
  *    description: "Use to obtain results from Abandoned Object algorithm for an specific camera under a range of time"
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
  *                  example: cam_id
  *                start:
  *                  description: "Date for initial range. Format: 2020-10-01T03:00:00.000Z."
  *                  type: string
  *                  example: 2020-10-01T03:00:00.000Z
  *                end:
  *                  description: "Date for end range. Format: 2020-10-01T03:00:00.000Z."
  *                  type: string
  *                  example: 2020-11-01T02:59:59.000Z
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
    "/api/analytics/aod/:id",
    [authJwt.verifyToken],
    controller.aod
  );
/**
  * @swagger
  * /api/analytics/covered/{id}:
  *   post:
  *    tags:
  *       - Analytics
  *    summary: "No Mask analytic's results"
  *    description: "Use to obtain results from No Mask algorithm for an specific camera under a range of time"
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
  *                  example: cam_id
  *                start:
  *                  description: "Date for initial range. Format: 2020-10-01T03:00:00.000Z."
  *                  type: string
  *                  example: 2020-10-01T03:00:00.000Z
  *                end:
  *                  description: "Date for end range. Format: 2020-10-01T03:00:00.000Z."
  *                  type: string
  *                  example: 2020-11-01T02:59:59.000Z
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
    "/api/analytics/covered/:id",
    [authJwt.verifyToken],
    controller.covered
  );

  app.get(
    "/api/analytics/covered/alerts",
    [authJwt.verifyToken],
    controller.coveredAlerts
  );

/**
  * @swagger
  * /api/analytics/social/{id}:
  *   post:
  *    tags:
  *       - Analytics
  *    summary: "Social Distance analytic's results"
  *    description: "Use to obtain results from Social Distance algorithm for an specific camera under a range of time"
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
  *                  example: cam_id
  *                start:
  *                  description: "Date for initial range. Format: 2020-10-01T03:00:00.000Z."
  *                  type: string
  *                  example: 2020-10-01T03:00:00.000Z
  *                end:
  *                  description: "Date for end range. Format: 2020-10-01T03:00:00.000Z."
  *                  type: string
  *                  example: 2020-11-01T02:59:59.000Z
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
    "/api/analytics/social/:id",
    [authJwt.verifyToken],
    controller.social
  );

  app.get(
    "/api/analytics/social/alerts",
    [authJwt.verifyToken],
    controller.socialAlerts
  );

/**
  * @swagger
  * /api/analytics/pc/{id}:
  *   post:
  *    tags:
  *       - Analytics
  *    summary: "People Count analytic's results"
  *    description: "Use to obtain results from People Count algorithm for an specific camera under a range of time"
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
  *                  example: cam_id
  *                start:
  *                  description: "Date for initial range. Format: 2020-10-01T03:00:00.000Z."
  *                  type: string
  *                  example: 2020-10-01T03:00:00.000Z
  *                end:
  *                  description: "Date for end range. Format: 2020-10-01T03:00:00.000Z."
  *                  type: string
  *                  example: 2020-11-01T02:59:59.000Z
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
    "/api/analytics/pc/:id",
    [authJwt.verifyToken],
    controller.pc
  );

  /**
  * @swagger
  * /api/analytics/helm/{id}:
  *   post:
  *    tags:
  *       - Analytics
  *    summary: "Helmet Detection analytic's results"
  *    description: "Use to obtain results from Helmet Detection algorithm for an specific camera under a range of time"
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
  *                  example: cam_id
  *                start:
  *                  description: "Date for initial range. Format: 2020-10-01T03:00:00.000Z."
  *                  type: string
  *                  example: 2020-10-01T03:00:00.000Z
  *                end:
  *                  description: "Date for end range. Format: 2020-10-01T03:00:00.000Z."
  *                  type: string
  *                  example: 2020-11-01T02:59:59.000Z
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
    "/api/analytics/helm/:id",
    [authJwt.verifyToken],
    controller.helm
  );

  /**
  * @swagger
  * /api/analytics/queue/{id}:
  *   post:
  *    tags:
  *       - Analytics
  *    summary: "Queue Management analytic's results"
  *    description: "Use to obtain results from Queue Management algorithm for an specific camera under a range of time"
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
  *                  example: cam_id
  *                start:
  *                  description: "Date for initial range. Format: 2020-10-01T03:00:00.000Z."
  *                  type: string
  *                  example: 2020-10-01T03:00:00.000Z
  *                end:
  *                  description: "Date for end range. Format: 2020-10-01T03:00:00.000Z."
  *                  type: string
  *                  example: 2020-11-01T02:59:59.000Z
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
    "/api/analytics/queue/:id",
    [authJwt.verifyToken],
    controller.queue
  );

  app.get(
    "/api/analytics/queue/alerts",
    [authJwt.verifyToken],
    controller.queueAlerts
  );

/**
  * @swagger
  * /api/analytics/vault/{id}:
  *   post:
  *    tags:
  *       - Analytics
  *    summary: "Open Vault Door analytic's results"
  *    description: "Use to obtain results from Open Vault Door algorithm for an specific camera under a range of time"
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
  *                  example: cam_id
  *                start:
  *                  description: "Date for initial range. Format: 2020-10-01T03:00:00.000Z."
  *                  type: string
  *                  example: 2020-10-01T03:00:00.000Z
  *                end:
  *                  description: "Date for end range. Format: 2020-10-01T03:00:00.000Z."
  *                  type: string
  *                  example: 2020-11-01T02:59:59.000Z
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
    "/api/analytics/vault/:id",
    [authJwt.verifyToken],
    controller.vault
  );

/**
  * @swagger
  * /api/analytics/parking/{id}:
  *   post:
  *    tags:
  *       - Analytics
  *    summary: "Parkin Violation analytic's results"
  *    description: "Use to obtain results from Parkin Violation algorithm for an specific camera under a range of time"
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
  *                  example: cam_id
  *                start:
  *                  description: "Date for initial range. Format: 2020-10-01T03:00:00.000Z."
  *                  type: string
  *                  example: 2020-10-01T03:00:00.000Z
  *                end:
  *                  description: "Date for end range. Format: 2020-10-01T03:00:00.000Z."
  *                  type: string
  *                  example: 2020-11-01T02:59:59.000Z
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
    "/api/analytics/parking/:id",
    [authJwt.verifyToken],
    controller.parking
  );

  /**
  * @swagger
  * /api/analytics/anpr/{id}:
  *   post:
  *    tags:
  *       - Analytics
  *    summary: "Automatic Number Plate Recognition (ANPR) analytic's results"
  *    description: "Use to obtain results from Automatic Number Plate Recognition (ANPR) algorithm for an specific camera under a range of time"
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
  *                  example: cam_id
  *                start:
  *                  description: "Date for initial range. Format: 2020-10-01T03:00:00.000Z."
  *                  type: string
  *                  example: 2020-10-01T03:00:00.000Z
  *                end:
  *                  description: "Date for end range. Format: 2020-10-01T03:00:00.000Z."
  *                  type: string
  *                  example: 2020-11-01T02:59:59.000Z
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
    "/api/analytics/anpr/:id",
    [authJwt.verifyToken],
    controller.anpr
  );

  /**
  * @swagger
  * /api/analytics/barrier/{id}:
  *   post:
  *    tags:
  *       - Analytics
  *    summary: "Barrier Detection analytic's results"
  *    description: "Use to obtain results from Barrier Detection algorithm for an specific camera under a range of time"
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
  *                  example: cam_id
  *                start:
  *                  description: "Date for initial range. Format: 2020-10-01T03:00:00.000Z."
  *                  type: string
  *                  example: 2020-10-01T03:00:00.000Z
  *                end:
  *                  description: "Date for end range. Format: 2020-10-01T03:00:00.000Z."
  *                  type: string
  *                  example: 2020-11-01T02:59:59.000Z
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
    "/api/analytics/barrier/:id",
    [authJwt.verifyToken],
    controller.barrier
  );

  /**
  * @swagger
  * /api/analytics/vehicle/{id}:
  *   post:
  *    tags:
  *       - Analytics
  *    summary: "Vehicle Count analytic's results"
  *    description: "Use to obtain results from Vehicle Count algorithm for an specific camera under a range of time"
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
  *                  example: cam_id
  *                start:
  *                  description: "Date for initial range. Format: 2020-10-01T03:00:00.000Z."
  *                  type: string
  *                  example: 2020-10-01T03:00:00.000Z
  *                end:
  *                  description: "Date for end range. Format: 2020-10-01T03:00:00.000Z."
  *                  type: string
  *                  example: 2020-11-01T02:59:59.000Z
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
    "/api/analytics/vehicle/:id",
    [authJwt.verifyToken],
    controller.vc
  );

  /**
  * @swagger
  * /api/analytics/queueLite/{id}:
  *   post:
  *    tags:
  *       - Overview Dashboard
  *    summary: "Queue Managemente Lite results"
  *    description: "Use to obtain results from Queue Managemente algorithm for an specific camera under a range of time. This is the lite version to load main Dashboard overview."
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
  *                  example: cam_id
  *                start:
  *                  description: "Date for initial range. Format: 2020-10-01T03:00:00.000Z."
  *                  type: string
  *                  example: 2020-10-01T03:00:00.000Z
  *                end:
  *                  description: "Date for end range. Format: 2020-10-01T03:00:00.000Z."
  *                  type: string
  *                  example: 2020-11-01T02:59:59.000Z
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
    "/api/analytics/queueLite/:id",
    [authJwt.verifyToken],
    controller.queueLite
  );

/**
  * @swagger
  * /api/analytics/pcLite/{id}:
  *   post:
  *    tags:
  *       - Overview Dashboard
  *    summary: "People Count lite results"
  *    description: "Use to obtain results from People Count algorithm for an specific camera under a range of time. This is the lite version for Overview Dashboard."
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
  *                  example: cam_id
  *                start:
  *                  description: "Date for initial range. Format: 2020-10-01T03:00:00.000Z."
  *                  type: string
  *                  example: 2020-10-01T03:00:00.000Z
  *                end:
  *                  description: "Date for end range. Format: 2020-10-01T03:00:00.000Z."
  *                  type: string
  *                  example: 2020-11-01T02:59:59.000Z
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
    "/api/analytics/pcLite/:id",
    [authJwt.verifyToken],
    controller.pcLite
  );

/**
  * @swagger
  * /api/analytics/premises/{id}:
  *   post:
  *    tags:
  *       - Overview Dashboard
  *    summary: "Premises overview results"
  *    description: "Use to obtain results from Premises for an specific camera under a range of time. This is for the main overview Dashboard."
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
  *                  example: cam_id
  *                start:
  *                  description: "Date for initial range. Format: 2020-10-01T03:00:00.000Z."
  *                  type: string
  *                  example: 2020-10-01T03:00:00.000Z
  *                end:
  *                  description: "Date for end range. Format: 2020-10-01T03:00:00.000Z."
  *                  type: string
  *                  example: 2020-11-01T02:59:59.000Z
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
    "/api/analytics/premises/:id",
    [authJwt.verifyToken],
    controller.premises
  );

  /**
  * @swagger
  * /api/analytics/threats/{id}:
  *   post:
  *    tags:
  *       - Overview Dashboard
  *    summary: "Threats overview results"
  *    description: "Use to obtain results from Threats for an specific camera under a range of time. This is for the main overview Dashboard."
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
  *                  example: cam_id
  *                start:
  *                  description: "Date for initial range. Format: 2020-10-01T03:00:00.000Z."
  *                  type: string
  *                  example: 2020-10-01T03:00:00.000Z
  *                end:
  *                  description: "Date for end range. Format: 2020-10-01T03:00:00.000Z."
  *                  type: string
  *                  example: 2020-11-01T02:59:59.000Z
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
    "/api/analytics/threats/:id",
    [authJwt.verifyToken],
    controller.threats
  );
  /**
  * @swagger
  * /api/analytics/tamper/{id}:
  *   post:
  *    tags:
  *       - Analytics
  *    summary: "Camera Tamper analytic's results"
  *    description: "Use to obtain results from Camera Tamper algorithm for an specific camera under a range of time"
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
  *                  example: cam_id
  *                start:
  *                  description: "Date for initial range. Format: 2020-10-01T03:00:00.000Z."
  *                  type: string
  *                  example: 2020-10-01T03:00:00.000Z
  *                end:
  *                  description: "Date for end range. Format: 2020-10-01T03:00:00.000Z."
  *                  type: string
  *                  example: 2020-11-01T02:59:59.000Z
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
    "/api/analytics/tamper/:id",
    [authJwt.verifyToken],
    controller.tamper
  );
}