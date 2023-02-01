const db = require('../models')
require('dotenv').config({ path: '../../../config.env' })
const Camera = db.camera
const Relations = db.relation
const jwt = require('jsonwebtoken')
const { v4: uuidv4 } = require('uuid')
const fs = require('fs')

const path =
  process.env.home + process.env.username + process.env.pathDocker + process.env.resources

exports.addCamera = async (req, res) => {
  const token = req.headers['x-access-token']

  jwt.verify(token, process.env.secret, async (_err, decoded) => {
    const uuid = uuidv4()
    // Save User to Database
    Camera.create({
      id: uuid,
      name: req.body.name,
      rtsp_in: req.body.rtsp_in,
      id_account: decoded.id_account,
      id_branch: decoded.id_branch,
      stored_vid: 'No'
    })
      .then(async _camera => {
        await Relations.create({
          camera_id: uuid,
          algo_id: 73,
          roi_id: null,
          atributes: null,
          id_account: decoded.id_account,
          id_branch: decoded.id_branch
        })
        res
          .status(200)
          .send({ success: true, message: 'Camera was registered successfully!', id: uuid })
      })
      .catch(err => {
        res.status(500).send({ success: false, message: err.message })
      })
  })
}

exports.viewCams = async (req, res) => {
  const token = req.headers['x-access-token']

  jwt.verify(token, process.env.secret, async (_err, decoded) => {
    Camera.findAll({
      where: { id_branch: decoded.id_branch },
      attributes: ['name', 'id', 'rtsp_in', 'createdAt', 'updatedAt']
    })
      .then(async cameras => {
        for (const camera of cameras) {
          const rel = await Relations.findAll({
            where: { camera_id: camera.id }
          })
          camera.dataValues.stream = rel[0].http_out
        }
        res.status(200).send({ success: true, data: cameras })
      })
      .catch(err => {
        console.log(err)
        res.status(500).send({ success: false, message: err.message })
      })
  })
}

exports.viewLiveCams = (req, res) => {
  const token = req.headers['x-access-token']

  jwt.verify(token, process.env.secret, async (_err, decoded) => {
    Camera.findAll({
      where: { id_branch: decoded.id_branch, stored_vid: 'No' },
      attributes: ['name', 'id', 'createdAt', 'updatedAt', 'heatmap_pic']
    })
      .then(cameras => {
        res.status(200).send({ success: true, data: cameras })
      })
      .catch(err => {
        res.status(500).send({ success: false, message: err.message })
      })
  })
}

exports.viewCam = (req, res) => {
  const token = req.headers['x-access-token']

  jwt.verify(token, process.env.secret, async (_err, decoded) => {
    Camera.findOne({
      where: { id: req.params.id, id_branch: decoded.id_branch }
    })
      .then(camera => {
        res.status(200).send({ success: true, data: camera })
      })
      .catch(err => {
        res.status(500).send({ success: false, message: err.message })
      })
  })
}

exports.delCam = async (req, res) => {
  const token = req.headers['x-access-token']

  jwt.verify(token, process.env.secret, async (_err, decoded) => {
    await Relations.destroy({
      where: { camera_id: req.params.id }
    })
    const img = `${path}${decoded.id_account}/${decoded.id_branch}/heatmap_pics/${req.params.id}_heatmap.png`
    fs.unlink(img, err => {
      if (err) console.log({ success: false, message: 'Image error: ' + err })
    })
    Camera.destroy({
      where: { id: req.params.id, id_branch: decoded.id_branch, stored_vid: 'No' }
    })
      .then(_cam => {
        res.status(200).send({ success: true, camera: req.params.uuid })
      })
      .catch(err => {
        res.status(500).send({ success: false, message: err.message })
      })
  })
}

exports.editCam = (req, res) => {
  const updt = req.body
  const token = req.headers['x-access-token']

  jwt.verify(token, process.env.secret, async (_err, decoded) => {
    Camera.update(updt, {
      where: { id: req.params.id, id_branch: decoded.id_branch, stored_vid: 'No' }
    })
      .then(_cam => {
        res.status(200).send({ success: true, data: updt })
      })
      .catch(err => {
        res.status(500).send({ success: false, message: err.message })
      })
  })
}
