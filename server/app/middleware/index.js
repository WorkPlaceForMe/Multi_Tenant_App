const authJwt = require("./authJwt");
const verifySignUp = require("./verifySignUp");
const verifyCam = require("./verifyCam");
const verifyRel = require("./verifyRel");

module.exports = {
  verifyCam,
  authJwt,
  verifySignUp,
  verifyRel
};