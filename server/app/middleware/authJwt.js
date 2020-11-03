const jwt = require("jsonwebtoken");
require('dotenv').config({ path: '../../config.env'});
const db = require("../models");
const User = db.user;

verifyToken = (req, res, next) => {
  let token = req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send({
      message: "No token provided!"
    });
  }

  jwt.verify(token, process.env.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        message: "Unauthorized!"
      });
    }
    req.userId = decoded.id;
    next();
  });
};

isAdmin = (req, res, next) => {
  User.findByPk(req.userId).then(user => {
        if (user.role === "admin") {
          next();
          return;
        }

      res.status(403).send({
        message: "Require Admin Role!"
      });
      return;
  });
};

isBranch = (req, res, next) => {
  User.findByPk(req.userId).then(user => {

        if (user.role === "branch") {
          next();
          return;
        }     

      res.status(403).send({
        message: "Require Branch Role!"

    });
  });
};

isClient = (req, res, next) => {
  User.findByPk(req.userId).then(user => {
        if (user.role === "client") {
          next();
          return;
        }

      res.status(403).send({
        message: "Require Client Role!"
      });
      return;
  });
};

isClientOrBranch = (req, res, next) => {
  User.findByPk(req.userId).then(user => {
        if (user.role === "client") {
          next();
          return;
        }

        if (user.role === "branch") {
          next();
          return;
        }

      res.status(403).send({
        message: "Require Client or Branch account!"
    });
  });
};

isClientOrBranchOrAdmin = (req, res, next) => {
  User.findByPk(req.userId).then(user => {
        if (user.role === "client") {
          next();
          return;
        }

        if (user.role === "branch") {
          next();
          return;
        }

        if (user.role === "admin") {
          next();
          return;
        }

      res.status(403).send({
        message: "Require Client or Branch or Admin account!"
    });
  });
};

const authJwt = {
  verifyToken: verifyToken,
  isAdmin: isAdmin,
  isBranch: isBranch,
  isClient: isClient,
  isClientOrBranch: isClientOrBranch,
  isClientOrBranchOrAdmin: isClientOrBranchOrAdmin
};
module.exports = authJwt;