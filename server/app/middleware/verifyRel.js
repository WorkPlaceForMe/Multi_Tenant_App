const db = require('../models')
const Relations = db.relation
const jwt = require('jsonwebtoken')
const User = db.user

const numRels = (req, res, next) => {
  // Username
  const token = req.headers['x-access-token']

  jwt.verify(token, process.env.secret, (err, decoded) => {
    User.findOne({
      where: {
        id: decoded.id_account
      }
    }).then(resp => {
      Relations.findAll({
        where: {
          id_account: decoded.id_account
        }
      }).then(analytics => {
        if (analytics.length >= resp.analytics) {
          res.status(400).send({
            success: false,
            type: 'analytics',
            message: 'Failed! Number of analytics exceeded!'
          })
          return
        }

        next()
      })
    })
  })
}

const verifyCamera = {
  numRels: numRels
}

module.exports = verifyCamera
