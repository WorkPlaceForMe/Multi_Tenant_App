const db = require('../models')
require('dotenv').config({ path: '../../../config.env' })
const jwt = require('jsonwebtoken')
const User = db.user
const Algorithm = db.algorithm

const Op = db.Sequelize.Op

exports.getAlgos = (req, res) => {
  const token = req.headers['x-access-token']

  jwt.verify(token, process.env.secret, (err, decoded) => {
    User.findOne({
      where: { id: decoded.id_account }
    })
      .then(user => {
        const authorities = []
        user.getAlgorithms().then(roles => {
          for (let i = 0; i < roles.length; i++) {
            authorities.push(roles[i].name)
          }
          Algorithm.findAll()
            .then(algos => {
              const algors = []
              for (const a of authorities) {
                for (const b of algos) {
                  if (a == b.name) {
                    algors.push({ id: b.id, name: b.name, available: 1 })
                  }
                }
              }
              res.status(200).send({
                success: true,
                data: algors
              })
            })
            .catch(err => {
              res.status(500).send({ success: false, message: err })
            })
        })
      })
      .catch(err => {
        return res.status(500).send({ success: false, message: err })
      })
  })
}

exports.updtAlgo = (req, res) => {
  User.findOne({
    where: { id: req.params.id }
  }).then(user => {
    if (req.body.algorithm) {
      Algorithm.findAll({
        where: {
          name: {
            [Op.or]: req.body.algorithm
          }
        }
      })
        .then(roles => {
          user.setAlgorithms(roles).then(() => {
            res.status(200).send({ success: true, message: 'Algorithms updated' })
          })
        })
        .catch(err => {
          res.status(500).send({ success: false, message: err })
        })
    }
  })
}

exports.viewAlgos = (req, res) => {
  Algorithm.findAll()
    .then(algos => {
      res.status(200).send({ success: true, data: algos })
    })
    .catch(err => {
      res.status(500).send({ success: false, message: err.message })
    })
}

exports.getAlgoById = (req, res) => {
  Algorithm.findOne({ where: { id: req.params.id } })
    .then(algo => {
      res.status(200).send({ success: true, data: algo })
    })
    .catch(err => {
      res.status(500).send({ success: false, message: err.message })
    })
}
