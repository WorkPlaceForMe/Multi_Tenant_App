require('dotenv').config({
  path: '../../config.env'
})
const jwt = require('jsonwebtoken')
const fs = require('fs')
const db = require('../models')
const {v4: uuidv4} = require('uuid')
const multer = require('multer')
const User = db.user
const ManualTrigger = db.manualTrigger
// const path =
// process.env.home + process.env.username + process.env.pathDocker + process.env.resources
const path = require('path')

const storage = multer.diskStorage({
  // multers disk storage settings
  filename: function (req, file, cb) {
    // console.log(file)
    const format = file.originalname.split('.')[1]
    const imageTypes = ['jpg', 'png', 'jpeg']
    if (!format || !imageTypes.includes(format.toLowerCase())) {
      req.fileValidationError = 'Provided file is not an image file'
      cb(new Error(req.fileValidationError))
    }
    const newName = Date.now() + '.' + format
    cb(null, newName)
  },
  destination: function (req, file, cb) {
    const token = req.headers['x-access-token']
    const format = file.originalname.split('.')[1]
    // console.log(file)
    file.originalname = format
      ? file.originalname
      : file.originalname + '.' + file.mimetype.split('/')[1] // FOR BLOB FILE TEST
    jwt.verify(token, process.env.secret, (_err, decoded) => {
      //  const storagePath = `${path}manualTrigger/${decoded.id}/`
      const storagePath = path.resolve(__dirname, `../../resources/manualTriggers/${decoded.id}/`)

      if (!fs.existsSync(storagePath)) {
        fs.mkdirSync(storagePath, {
          recursive: true
        })
      }
      cb(null, storagePath)
    })
  }
})

const uploadImage = multer({
  // multer settings
  storage: storage
}).single('file')

exports.createManualTrigger = (req, res) => {
  const uuid = uuidv4()
  const token = req.headers['x-access-token']
  uploadImage(req, res, async function (err) {
    if (err) {
      if (req.fileValidationError) {
        return res.status(400).json({
          success: false,
          error_code: 1,
          message: req.fileValidationError
        })
      } else {
        return res.status(500).json({
          success: false,
          error_code: 1,
          message: err
        })
      }
    } else {
      try {
        // if (!req.file) {
        //   return res.status(400).json({
        //     success: false,
        //     error_code: 1,
        //     message: 'Image is required'
        //   })
        // }
        const decoded = await jwt.verify(token, process.env.secret)
        const reqBody = req.body

        if (!reqBody.cameraId) {
          return res.status(400).json({
            success: false,
            error_code: 1,
            message: 'Camera id is required'
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
          description: reqBody.description || '',
          severity: reqBody.severity || '',
          camera_id: reqBody.cameraId,
          image_path: req.file ? req.file.path : null,
          http_in: req.file
            ? `${process.env.app_url}/api/pictures/manualTriggers/${decoded.id}/${req.file.filename}`
            : null
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
  })
}

exports.saveSnapshot = (req, res) => {
  const token = req.headers['x-access-token']
  uploadImage(req, res, async function (err) {
    if (err) {
      if (req.fileValidationError) {
        return res.status(400).json({
          success: false,
          error_code: 1,
          message: req.fileValidationError
        })
      } else {
        return res.status(500).json({
          success: false,
          error_code: 1,
          message: err
        })
      }
    } else {
      try {
        if (!req.file) {
          return res.status(400).json({
            success: false,
            error_code: 1,
            message: 'Image is required'
          })
        }
        const decoded = await jwt.verify(token, process.env.secret)
        res.status(200).send({
          success: true,
          message: 'Snapshot saved successfully!',
          snapshot: `${process.env.app_url}/api/pictures/manualTriggers/${decoded.id}/${req.file.filename}`
        })
      } catch (error) {
        res.status(500).json({
          success: false,
          message: error
        })
      }
    }
  })
}
