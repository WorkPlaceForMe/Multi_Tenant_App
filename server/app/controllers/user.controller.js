const db = require('../models')
require('dotenv').config({ path: '../../../config.env' })
const jwt = require('jsonwebtoken')
const User = db.user
const Camera = db.camera
const Relation = db.relation
const bcrypt = require('bcryptjs')
const path =
  process.env.home + process.env.username + process.env.pathDocker + process.env.resources
const fs = require('fs')

// Add heatmap to be deleted

exports.viewClientUnder = (req, res) => {
  const token = req.headers['x-access-token']

  jwt.verify(token, process.env.secret, (err, decoded) => {
    User.findAll({
      where: { id_account: decoded.id_account, role: 'branch' },
      attributes: [
        'username',
        'email',
        'id_account',
        'id_branch',
        'createdAt',
        'role',
        'id',
        'updatedAt',
        'disabled'
      ]
    })
      .then(accounts => {
        res.status(200).send({ success: true, data: accounts })
      })
      .catch(err => {
        res.status(500).send({ success: false, message: err.message })
      })
  })
}

exports.viewBranchUnder = (req, res) => {
  const token = req.headers['x-access-token']

  jwt.verify(token, process.env.secret, (err, decoded) => {
    User.findAll({
      where: { id_branch: decoded.id_branch, role: 'user' },
      attributes: [
        'username',
        'email',
        'id_account',
        'id_branch',
        'createdAt',
        'role',
        'id',
        'updatedAt',
        'disabled'
      ]
    })
      .then(accounts => {
        res.status(200).send({ success: true, data: accounts })
      })
      .catch(err => {
        res.status(500).send({ success: false, message: err.message })
      })
  })
}

exports.viewAdminUnder = (req, res) => {
  User.findAll({
    where: { role: ['client', 'admin'] },
    attributes: [
      'username',
      'email',
      'id_account',
      'id_branch',
      'createdAt',
      'role',
      'id',
      'updatedAt',
      'disabled'
    ]
  })
    .then(accounts => {
      for (let i = 0; i < accounts.length; i++) {
        if (accounts[i].id === '0000-11111-aaaaaa-bbbbbb') {
          accounts.splice(i, 1)
        }
      }

      res.status(200).send({ success: true, data: accounts })
    })
    .catch(err => {
      res.status(500).send({ success: false, message: err.message })
    })
}

exports.editUser = (req, res) => {
  const updt = req.body
  if (updt.hasOwnProperty('password')) {
    delete updt.password
  }
  if (updt.disable === true) {
    updt.disable = 1
  } else {
    updt.disable = 0
  }
  User.update(updt, {
    where: { role: 'user', id: req.params.uuid }
  })
    .then(user => {
      res.status(200).send({ success: true, data: updt })
    })
    .catch(err => {
      res.status(500).send({ success: false, message: err.message })
    })
}

exports.editBranch = (req, res) => {
  const updt = req.body
  if (updt.hasOwnProperty('password')) {
    delete updt.password
  }
  if (updt.disable === true) {
    updt.disable = 1
  } else {
    updt.disable = 0
  }
  User.update(updt, {
    where: { role: 'branch', id: req.params.uuid }
  })
    .then(user => {
      res.status(200).send({ success: true, data: updt })
    })
    .catch(err => {
      res.status(500).send({ success: false, message: err.message })
    })
}

exports.editClient = (req, res) => {
  const updt = req.body
  if (updt.hasOwnProperty('password')) {
    delete updt.password
  }
  if (updt.disabled === true) {
    updt.disabled = 1
  } else {
    updt.disabled = 0
  }
  User.update(updt, {
    where: { role: 'client', id: req.params.uuid }
  })
    .then(user => {
      res.status(200).send({ success: true, data: updt })
    })
    .catch(err => {
      res.status(500).send({ success: false, message: err.message })
    })
}

exports.editAdmin = (req, res) => {
  const updt = req.body
  if (updt.hasOwnProperty('password')) {
    delete updt.password
  }
  if (updt.disable === true) {
    updt.disable = 1
  } else {
    updt.disable = 0
  }
  User.update(updt, {
    where: { role: 'admin', id: req.params.uuid }
  })
    .then(user => {
      res.status(200).send({ success: true, data: updt })
    })
    .catch(err => {
      res.status(500).send({ success: false, message: err.message })
    })
}

exports.deleteUser = (req, res) => {
  User.destroy({
    where: { role: 'user', id: req.params.uuid }
  })
    .then(user => {
      res.status(200).send({ success: true, user: req.params.uuid })
    })
    .catch(err => {
      res.status(500).send({ success: false, message: err.message })
    })
}

exports.deleteAdmin = (req, res) => {
  User.destroy({
    where: { role: 'admin', id: req.params.uuid }
  })
    .then(user => {
      res.status(200).send({ success: true, user: req.params.uuid })
    })
    .catch(err => {
      res.status(500).send({ success: false, message: err.message })
    })
}

exports.deleteBranch = (req, res) => {
  const id = req.params.uuid
  User.findOne({
    where: { id: id }
  })
    .then(user => {
      const folder = `${path}${user.id_account}/${user.id_branch}`
      fs.rmdir(folder, { recursive: true }, err => {
        if (err) {
          return res.status(500).send({ success: false, message: err.message })
        }
      })
      Camera.destroy({
        where: { id_branch: id }
      })
      Relation.destroy({
        where: { id_branch: id }
      })
      User.destroy({
        where: { id_branch: id }
      })
        .then(user => {
          res.status(200).send({ success: true, branch: id })
        })
        .catch(err => {
          res.status(500).send({ success: false, message: err.message })
        })
    })
    .catch(err => {
      return res.status(500).send({ success: false, message: err.message })
    })
}

exports.deleteClient = (req, res) => {
  const id = req.params.uuid
  User.findOne({
    where: { id: id }
  })
    .then(user => {
      const folder = `${path}${user.id_account}`
      fs.rmdir(folder, { recursive: true }, err => {
        if (err) {
          return res.status(500).send({ success: false, message: err.message })
        }
      })
      Camera.destroy({
        where: { id_account: id }
      })
      Relation.destroy({
        where: { id_account: id }
      })
      User.destroy({
        where: { id_account: id }
      })
        .then(user => {
          res.status(200).send({ success: true, client: req.params.uuid })
        })
        .catch(err => {
          res.status(500).send({ success: false, message: err.message })
        })
    })
    .catch(err => {
      return res.status(500).send({ success: false, message: err.message })
    })
}

exports.changePass = (req, res) => {
  const updt = req.body
  ;(updt.password = bcrypt.hashSync(updt.password, 12)),
  User.update(updt, {
    where: { id: req.params.uuid }
  })
    .then(user => {
      res.status(200).send({ success: true, id: req.params.uuid })
    })
    .catch(err => {
      res.status(500).send({ success: false, message: err.message })
    })
}

exports.viewOneAd = (req, res) => {
  const id = req.params.uuid
  User.findOne({
    where: { id: id },
    attributes: [
      'username',
      'email',
      'id_account',
      'id_branch',
      'createdAt',
      'role',
      'id',
      'updatedAt',
      'disabled',
      'cameras',
      'analytics',
      'vms'
    ]
  })
    .then(user => {
      const authorities = []
      user.getAlgorithms().then(roles => {
        for (let i = 0; i < roles.length; i++) {
          authorities.push(roles[i].name)
        }
        user.dataValues.algorithm = authorities
        res.status(200).send({
          success: true,
          data: user
        })
      })
    })
    .catch(err => {
      return res.status(500).send({ success: false, message: err.message })
    })
}

exports.viewOne = (req, res) => {
  const id = req.params.uuid
  User.findOne({
    where: { id: id },
    attributes: [
      'username',
      'email',
      'id_account',
      'id_branch',
      'createdAt',
      'role',
      'id',
      'updatedAt',
      'disabled',
      'vms'
    ]
  })
    .then(user => {
      res.status(200).send({ success: true, data: user })
    })
    .catch(err => {
      return res.status(500).send({ success: false, message: err.message })
    })
}

exports.remaining = (req, res) => {
  const token = req.headers['x-access-token']

  jwt.verify(token, process.env.secret, (err, decoded) => {
    User.findOne({
      where: {
        id: decoded.id_account
      }
    })
      .then(user => {
        Camera.count({
          where: {
            id_account: decoded.id_account
          }
        }).then(countC => {
          Relation.count({
            where: {
              id_account: decoded.id_account
            }
          }).then(countR => {
            const count = {
              analytics: user.analytics - countR,
              cameras: user.cameras - countC
            }
            res.status(200).send({ success: true, data: count })
          })
        })
      })
      .catch(err => {
        return res.status(500).send({ success: false, message: err.message })
      })
  })
}
