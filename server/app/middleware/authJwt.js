const jwt = require('jsonwebtoken')
require('dotenv').config({ path: '../../../config.env' })
const db = require('../models')
const User = db.user

const verifyToken = (req, res, next) => {
  let token = req.headers['x-access-token']

  // If token not available frokm header check if its available in query params
  if (!token) {
    token = req.query['x-access-token']
  }

  if (!token) {
    return res.status(403).send({
      message: 'No token provided!'
    })
  }

  jwt.verify(token, process.env.secret, (err, decoded) => {
    if (err || !decoded || !decoded.id) {
      return res.status(401).send({
        message: 'Unauthorized!'
      })
    }

    req.decodedJWT = decoded
    req.userId = decoded.id

    next()
  })
}

const isAdmin = (req, res, next) => {
  User.findByPk(req.userId).then(user => {
    if (user && user.role === 'admin') {
      next()
    } else {
      res.status(403).send({
        message: 'Require Admin Role!'
      })
    }
  })
}

const isBranch = (req, res, next) => {
  User.findByPk(req.userId).then(user => {
    if (user && user.role === 'branch') {
      next()
    } else {
      res.status(403).send({
        message: 'Require Branch Role!'
      })
    }
  })
}

const isClient = (req, res, next) => {
  User.findByPk(req.userId).then(user => {
    if (user && user.role === 'client') {
      next()
    } else {
      res.status(403).send({
        message: 'Require Client Role!'
      })
    }
  })
}

const isClientOrBranch = (req, res, next) => {
  User.findByPk(req.userId).then(user => {
    if (user && user.role === 'client') {
      next()
    } else if (user && user.role === 'branch') {
      next()
    } else {
      res.status(403).send({
        message: 'Require Client or Branch account!'
      })
    }
  })
}

const isClientOrBranchOrAdmin = (req, res, next) => {
  User.findByPk(req.userId).then(user => {
    if (user && user.role === 'client') {
      next()
    } else if (user && user.role === 'branch') {
      next()
    } else if (user && user.role === 'admin') {
      next()
    } else {
      res.status(403).send({
        message: 'Require Client or Branch or Admin account!'
      })
    }
  })
}

const isUserOrBranch = (req, res, next) => {
  User.findByPk(req.userId).then(user => {
    if (user && user.role === 'user') {
      next()
    } else if (user && user.role === 'branch') {
      next()
    } else {
      res.status(403).send({
        message: 'Require User or Branch account!'
      })
    }
  })
}

const isClientOrUserOrBranch = (req, res, next) => {
  User.findByPk(req.userId).then(user => {
    if (user && user.role === 'user') {
      next()
    } else if (user && user.role === 'branch') {
      next()
    } else if (user && user.role === 'client') {
      next()
    } else {
      res.status(403).send({
        message: 'Require Client or User or Branch account!'
      })
    }
  })
}

const isAvailable = (req, res, next) => {
  const id = req.params.id

  if (id === 'none') {
    res.status(202).send({
      message: 'Exists'
    })
  }

  next()
}

const authJwt = {
  verifyToken: verifyToken,
  isAdmin: isAdmin,
  isBranch: isBranch,
  isClient: isClient,
  isClientOrBranch: isClientOrBranch,
  isClientOrBranchOrAdmin: isClientOrBranchOrAdmin,
  isUserOrBranch: isUserOrBranch,
  isClientOrUserOrBranch: isClientOrUserOrBranch,
  isAvailable: isAvailable
}
module.exports = authJwt
