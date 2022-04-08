require('dotenv').config({
  path: '../../../config.env'
})
const jwt = require('jsonwebtoken')
const db = require('../models')
const { v4: uuidv4 } = require('uuid')
const User = db.user
const ManualTrigger = db.manualTrigger
const Camera = db.camera
const axios = require('axios')

exports.createManualTrigger = async (req, res) => {
  const uuid = uuidv4()
  const token = req.headers['x-access-token']
  try {
    const decoded = await jwt.verify(token, process.env.secret)
    const reqBody = req.body

    if (!reqBody.cameraId) {
      return res.status(400).json({
        success: false,
        error_code: 1,
        message: 'Camera id is required'
      })
    }

    if (!String(reqBody.algoId)) {
      return res.status(400).json({
        success: false,
        error_code: 1,
        message: 'Algorithm id is required'
      })
    }
    if (!reqBody.httpIn) {
      return res.status(400).json({
        success: false,
        error_code: 1,
        message: 'Screenshot is required'
      })
    }

    if (!(reqBody.results || reqBody.canvasWidth || reqBody.canvasHeight)) {
      return res.status(400).json({
        success: false,
        error_code: 1,
        message: 'Canvas width, height & results is required'
      })
    }

    if (!(reqBody.actions || reqBody.severity)) {
      return res.status(400).json({
        success: false,
        error_code: 1,
        message: 'Actions & severity both is required'
      })
    }

    const userDetails = await User.findByPk(decoded.id)
    if (!userDetails) {
      return res.status(400).json({
        success: false,
        error_code: 1,
        message: 'User not found'
      })
    }
    const data = {
      id: uuid,
      user_id: userDetails.id,
      actions: reqBody.actions,
      severity: reqBody.severity,
      camera_id: reqBody.cameraId,
      http_in: reqBody.httpIn,
      results: reqBody.results,
      canvasWidth: reqBody.canvasWidth,
      canvasHeight: reqBody.canvasHeight,
      algo_id: Number(reqBody.algoId)
    }

    const created = await ManualTrigger.create(data)
    if (!created) {
      return res.status(400).json({
        success: false,
        error_code: 1,
        message: 'There have some problem to create new trigger'
      })
    }
    res.status(200).send({
      success: true,
      message: 'Manual trigger created successfully!',
      id: uuid
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error
    })
  }
}

exports.getManualTriggers = async (req, res) => {
  try {
    // if (!req.params.algoId) {
    //   return res.status(400).json({
    //     success: false,
    //     error_code: 1,
    //     message: 'Algorithm id is required'
    //   })
    // }
    const manualTriggers = await ManualTrigger.findAll({
      // where: {algo_id: req.params.algoId},
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: Camera,
          attributes: ['id', 'name', 'createdAt']
        }
      ]
    })
    res.status(200).send({
      success: true,
      manualTriggers
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error
    })
  }
}

exports.getScreenshot = async (req, res) => {
  const uuid = uuidv4()
  const dat = req.body
  const token = req.headers['x-access-token']
  jwt.verify(token, process.env.secret, async (_err, decoded) => {
    try {
      const response = await axios.post(`${process.env.pythonApi}/api2/frame`, {
        stream: dat.stream,
        id_account: dat.id_account,
        id_branch: dat.id_branch,
        uuid: uuid
      })
      res.status(200).send({ success: true, data: response.data })
    } catch (err) {
      console.error(err)
      res.status(500).send({ success: false, message: err })
    }
  })
}
