const {v4: uuidv4} = require('uuid')
const multer = require('multer')
const fs = require('fs')
const jwt = require('jsonwebtoken')
const db = require('../models')
const HelpDesk = db.helpdesk
const Reply = db.reply
const User = db.user
const {Op} = require('sequelize')
const imageTypes = ['jpg', 'png', 'jpeg']
const path =
  process.env.home + process.env.username + process.env.pathDocker + process.env.resources

const storage = multer.diskStorage({
  // multers disk storage settings
  filename: function (req, file, cb) {
    const format = file.originalname.split('.')[1]
    if (!format || !imageTypes.includes(format.toLowerCase())) {
      req.fileValidationError = 'Provided file is not an image file'
      cb(new Error(req.fileValidationError))
    }
    const newName = Date.now() + '.' + format
    cb(null, newName)
  },
  destination: function (req, file, cb) {
    const storagePath = `${path}helpdesk/client/${req.params.id}`
    if (!fs.existsSync(storagePath)) {
      fs.mkdirSync(storagePath, {
        recursive: true
      })
    }
    cb(null, storagePath)
  }
})
const uploadImage = multer({
  // multer settings
  storage: storage
}).single('file')

exports.postReply = async (req, res) => {
  try {
    const uuid = uuidv4()
    const token = req.headers['x-access-token']
    if (!req.params.id) {
      return res.status(400).json({
        success: false,
        error_code: 1,
        message: 'Helpdesk id is required'
      })
    }
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
        const reqBody = req.body
        if (!req.params.id) {
          return res.status(400).json({
            success: false,
            error_code: 1,
            message: 'Helpdesk id is required'
          })
        }
        if (!reqBody.replyMessage) {
          return res.status(400).json({
            success: false,
            error_code: 1,
            message: 'Message is required'
          })
        }

        const decoded = await jwt.verify(token, process.env.secret)
        const helpdeskDetails = await HelpDesk.findByPk(req.params.id)
        if (!helpdeskDetails) {
          return res.status(400).json({
            success: false,
            error_code: 1,
            message: 'Helpdesk Details not found'
          })
        }

        const authToReply = await HelpDesk.findOne({
          where: {
            id: req.params.id,
            [Op.or]: [{client_id: decoded.id}, {user_id: decoded.id}]
          }
        })
        if (!authToReply) {
          return res.status(400).json({
            success: false,
            error_code: 1,
            message: 'You are not authorized to reply'
          })
        }
        const data = {
          id: uuid,
          helpdesk_id: req.params.id,
          user_id: decoded.id,
          message: reqBody.message,
          reply_message: reqBody.replyMessage,
          image_path: req.file ? req.file.path : null,
          http_in: req.file
            ? `${process.env.app_url}/api/pictures/helpdesk/client/${req.params.id}/${req.file.filename}`
            : null
        }

        const created = await Reply.create(data)
        if (!created) {
          return res.status(400).json({
            success: false,
            error_code: 1,
            message: 'There have some problem to create helpdesk reply'
          })
        }

        await HelpDesk.update({status: 'PROCESSING'}, {where: {id: req.params.id}})
        res.status(200).send({
          success: true,
          message: 'Helpdesk reply added successfully!',
          id: uuid
        })
      }
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error
    })
  }
}

exports.updateStatus = async (req, res) => {
  try {
    const token = req.headers['x-access-token']
    if (!req.params.id) {
      return res.status(400).json({
        success: false,
        error_code: 1,
        message: 'Helpdesk id is required'
      })
    }
    const {status} = req.body
    if (!status) {
      return res.status(400).json({
        success: false,
        error_code: 1,
        message: 'Status is required'
      })
    }
    const decoded = await jwt.verify(token, process.env.secret)
    const helpdeskDetails = await HelpDesk.findByPk(req.params.id)
    if (!helpdeskDetails) {
      return res.status(400).json({
        success: false,
        error_code: 1,
        message: 'Helpdesk Details not found'
      })
    }
    const currentUserDetails = await User.findByPk(decoded.id)
    if (currentUserDetails.role === 'client') {
      const isAuthClient = await User.findOne({
        where: {
          [Op.and]: [{id: helpdeskDetails.user_id}, {id_account: currentUserDetails.id}]
        }
      })
      if (!isAuthClient) {
        return res.status(400).json({
          success: false,
          error_code: 1,
          message: 'You are not authorized to update status'
        })
      }

      if (status !== 'RESOLVED') {
        return res.status(400).json({
          success: false,
          error_code: 1,
          message: 'Can not do this action'
        })
      }
    } else if (currentUserDetails.role === 'user' || currentUserDetails.role === 'branch') {
      if (helpdeskDetails.user_id !== currentUserDetails.id) {
        return res.status(400).json({
          success: false,
          error_code: 1,
          message: 'You are not authorized to update status'
        })
      }

      if (status !== 'REOPENED') {
        return res.status(400).json({
          success: false,
          error_code: 1,
          message: 'Can not do this action'
        })
      }
    }

    await HelpDesk.update({status}, {where: {id: helpdeskDetails.id}})

    res.status(200).send({
      success: true,
      message: 'Helpdesk status updated successfully!'
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error
    })
  }
}

exports.getReplies = async (req, res) => {
  try {
    const token = req.headers['x-access-token']
    if (!req.params.id) {
      return res.status(400).json({
        success: false,
        error_code: 1,
        message: 'Helpdesk id is required'
      })
    }

    const decoded = await jwt.verify(token, process.env.secret)

    const helpdeskDetails = await HelpDesk.findOne({
      where: {
        id: req.params.id,
        [Op.or]: [{client_id: decoded.id}, {user_id: decoded.id}]
      }
    })
    if (!helpdeskDetails) {
      return res.status(400).json({
        success: false,
        error_code: 1,
        message: 'Helpdesk details not found'
      })
    }
    const replies = await Reply.findAll({
      where: {helpdesk_id: helpdeskDetails.id},
      order: [['createdAt', 'ASC']]
    })

    res.status(200).send({
      success: true,
      replies
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error
    })
  }
}
