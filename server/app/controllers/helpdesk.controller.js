const {v4: uuidv4} = require('uuid')
const multer = require('multer')
const fs = require('fs')
const jwt = require('jsonwebtoken')
const db = require('../models')
const HelpDesk = db.helpdesk
const User = db.user
const imageTypes = ['jpg', 'png', 'jpeg']
const path =
  process.env.home + process.env.username + process.env.pathDocker + process.env.resources

const storage = multer.diskStorage({
  // multers disk storage settings
  filename: function (req, file, cb) {
    console.log(file, 'file')
    const format = file.originalname.split('.')[1]
    if (!format || !imageTypes.includes(format.toLowerCase())) {
      req.fileValidationError = 'Provided file is not an image file'
      cb(new Error(req.fileValidationError))
    }
    const newName = Date.now() + '.' + format
    cb(null, newName)
  },
  destination: function (req, file, cb) {
    const token = req.headers['x-access-token']

    jwt.verify(token, process.env.secret, (_err, decoded) => {
      const storagePath = `${path}helpdesk/${decoded.id}`

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

exports.generateNewIssue = (req, res) => {
  const uuid = uuidv4()
  const token = req.headers['x-access-token']
  uploadImage(req, res, async function (err) {
    if (err) {
      if (req.fileValidationError) {
        return res.status(400).json({
          success: false,
          error_code: 1,
          err_desc: req.fileValidationError
        })
      } else {
        return res.status(500).json({
          success: false,
          error_code: 1,
          err_desc: err
        })
      }
    } else {
      try {
        const decoded = await jwt.verify(token, process.env.secret)
        const reqBody = req.body
        if (!reqBody.title || !reqBody.message) {
          return res.status(400).json({
            success: false,
            error_code: 1,
            err_desc: 'Title and Message both are required'
          })
        }
        const userDetails = await User.findByPk(decoded.id)
        if (!userDetails) {
          return res.status(400).json({
            success: false,
            error_code: 1,
            err_desc: 'User not found'
          })
        }
        const data = {
          id: uuid,
          user_id: userDetails.id,
          title: reqBody.title,
          message: reqBody.message,
          user_type: userDetails.role,
          client_id: userDetails.id_account,
          image_path: req.file ? req.file.path : null,
          http_in: req.file
            ? `${process.env.app_url}/api/pictures/helpdesk/${decoded.id}/${req.file.filename}`
            : null
        }

        const created = await HelpDesk.create(data)
        if (!created) {
          return res.status(400).json({
            success: false,
            error_code: 1,
            err_desc: 'There have some problem to create new issue'
          })
        }
        res.status(200).send({
          success: true,
          message: 'Helpdesk message added successfully!',
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

exports.getHelpDeskIssus = async (req, res) => {
  try {
    const token = req.headers['x-access-token']
    const decoded = await jwt.verify(token, process.env.secret)
    const helpDeskIssues = await HelpDesk.findAll({
      where: {client_id: decoded.id}
    })
    if (!helpDeskIssues) {
      return res.status(400).json({
        success: false,
        error_code: 1,
        err_desc: 'Not able to get Help Desk Issues'
      })
    }
    res.status(200).send({
      success: true,
      helpDeskIssues
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error
    })
  }
}

exports.getGeneratedHelpDeskIssus = async (req, res) => {
  try {
    const token = req.headers['x-access-token']
    const decoded = await jwt.verify(token, process.env.secret)
    const helpDeskIssues = await HelpDesk.findAll({
      where: {user_id: decoded.id},
      order: [['createdAt', 'DESC']]
    })
    if (!helpDeskIssues) {
      return res.status(400).json({
        success: false,
        error_code: 1,
        err_desc: 'Not able to get Help Desk Issues'
      })
    }
    res.status(200).send({
      success: true,
      helpDeskIssues
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error
    })
  }
}
