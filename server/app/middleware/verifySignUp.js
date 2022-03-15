const db = require('../models')
const ALGOS = db.ALGORITHMS
const User = db.user

const checkDuplicateUsernameOrEmail = (req, res, next) => {
  // Username
  User.findOne({
    where: {
      username: req.body.username
    }
  }).then(user => {
    if (user) {
      res.status(400).send({
        success: false,
        repeated: 'Username',
        message: 'Failed! Username is already in use!'
      })
      return
    }

    // Email
    User.findOne({
      where: {
        email: req.body.email
      }
    }).then(user => {
      if (user) {
        res.status(400).send({
          success: false,
          repeated: 'Email',
          message: 'Failed! Email is already in use!'
        })
        return
      }

      next()
    })
  })
}

const checkDuplicateUsernameOrEmailEdit = (req, res, next) => {
  // Username
  User.findOne({
    where: {
      username: req.body.username
    }
  }).then(user => {
    if (user && req.params.uuid !== user.dataValues.id) {
      res.status(400).send({
        success: false,
        repeated: 'Username',
        message: 'Failed! Username is already in use!'
      })

      return
    }

    // Email
    User.findOne({
      where: {
        email: req.body.email
      }
    }).then(user => {
      if (user && req.params.uuid !== user.dataValues.id) {
        res.status(400).send({
          success: false,
          repeated: 'Email',
          message: 'Failed! Email is already in use!'
        })
        return
      }

      next()
    })
  })
}

const checkAlgosExisted = (req, res, next) => {
  if (req.body.algorithm) {
    for (let i = 0; i < req.body.algorithm.length; i++) {
      if (!ALGOS.includes(req.body.algorithm[i])) {
        res.status(400).send({
          message: 'Failed! Role does not exist = ' + req.body.algorithm[i]
        })
        return
      }
    }
  }

  next()
}

const verifySignUp = {
  checkDuplicateUsernameOrEmail: checkDuplicateUsernameOrEmail,
  checkAlgosExisted: checkAlgosExisted,
  checkDuplicateUsernameOrEmailEdit: checkDuplicateUsernameOrEmailEdit
}

module.exports = verifySignUp
