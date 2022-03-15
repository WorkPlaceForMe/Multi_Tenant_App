const jwt = require('jsonwebtoken')
require('dotenv').config({path: '../../config.env'})
const db = require('../models')
const User = db.user

const verifyToken = (req, res, next) => {
  const token = req.headers['x-access-token']

  if (!token) {
    return res.status(403).send({
      message: 'No token provided!'
    })
  }

  jwt.verify(token, process.env.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        message: 'Unauthorized!'
      })
    }
    req.userId = decoded.id
    next()
  })
}

const isAdmin = (req, res, next) => {
  User.findByPk(req.userId).then(user => {
    if (user.role === 'admin') {
      next()
      return
    }

    res.status(403).send({
      message: 'Require Admin Role!'
    })
  })
}

const isBranch = (req, res, next) => {
  User.findByPk(req.userId).then(user => {
    if (user.role === 'branch') {
      next()
      return
    }

    res.status(403).send({
      message: 'Require Branch Role!'
    })
  })
}

const isClient = (req, res, next) => {
  User.findByPk(req.userId).then(user => {
    if (user.role === 'client') {
      next()
      return
    }

    res.status(403).send({
      message: 'Require Client Role!'
    })
  })
}

const isClientOrBranch = (req, res, next) => {
  User.findByPk(req.userId).then(user => {
    if (user.role === 'client') {
      next()
      return
    }

    if (user.role === 'branch') {
      next()
      return
    }

    res.status(403).send({
      message: 'Require Client or Branch account!'
    })
  })
}

const isClientOrBranchOrAdmin = (req, res, next) => {
  User.findByPk(req.userId).then(user => {
    if (user.role === 'client') {
      next()
      return
    }

    if (user.role === 'branch') {
      next()
      return
    }

    if (user.role === 'admin') {
      next()
      return
    }

    res.status(403).send({
      message: 'Require Client or Branch or Admin account!'
    })
  })
}

const isUserOrBranch = (req, res, next) => {
  User.findByPk(req.userId).then(user => {
    if (user.role === 'user') {
      next()
      return
    }

    if (user.role === 'branch') {
      next()
      return
    }

    res.status(403).send({
      message: 'Require User or Branch account!'
    })
  })
}

const isClientOrUserOrBranch = (req, res, next) => {
  User.findByPk(req.userId).then(user => {
    if (user.role === 'user') {
      next()
      return
    }

    if (user.role === 'branch') {
      next()
      return
    }

    if (user.role === 'client') {
      next()
      return
    }

    res.status(403).send({
      message: 'Require Client or User or Branch account!'
    })
  })
}

const authJwt = {
  verifyToken: verifyToken,
  isAdmin: isAdmin,
  isBranch: isBranch,
  isClient: isClient,
  isClientOrBranch: isClientOrBranch,
  isClientOrBranchOrAdmin: isClientOrBranchOrAdmin,
  isUserOrBranch: isUserOrBranch,
  isClientOrUserOrBranch: isClientOrUserOrBranch
}
module.exports = authJwt
