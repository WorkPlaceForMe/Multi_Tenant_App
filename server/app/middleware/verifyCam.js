const db = require('../models')
const Camera = db.camera
const jwt = require('jsonwebtoken')
const User = db.user

const rtsp = (req, res, next) => {
  // Username
  const token = req.headers['x-access-token']

  jwt.verify(token, process.env.secret, (err, decoded) => {
    Camera.findOne({
      where: {
        rtsp_in: req.body.rtsp_in,
        id_branch: decoded.id_branch

      }
    }).then(camera => {
      if (camera) {
        res.status(400).send({
          success: false,
          type: 'rtsp',
          message: 'Failed! Rtsp is already in use!'
        })
        return
      }

      next()
    })
  })
}

const numCams = (req, res, next) => {
  // Username
  const token = req.headers['x-access-token']

  jwt.verify(token, process.env.secret, (err, decoded) => {
    User.findOne({
      where: {
        id: decoded.id_account
      }
    }).then(resp => {
      Camera.findAll({
        where: {
          id_account: decoded.id_account
        }
      }).then(cameras => {
        if (cameras.length >= resp.cameras) {
          res.status(400).send({
            success: false,
            type: 'camera',
            message: 'Failed! Number of cameras exceeded for this general account! Please get in contact with your administrator to increase the number of cameras.'
          })
          return
        }

        next()
      })
    })
  })
}

const verifyCamera = {
  rtsp: rtsp,
  numCams: numCams
}

module.exports = verifyCamera
