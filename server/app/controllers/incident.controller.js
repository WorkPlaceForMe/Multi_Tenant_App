const elasticsearch = require('@elastic/elasticsearch')
require('dotenv').config({
  path: '../../../config.env'
})
const jwt = require('jsonwebtoken')
const fs = require('fs')
const db = require('../models')
const { v4: uuidv4 } = require('uuid')
const moment = require('moment')
const dateTimeFormat = 'YYYY-MM-DD HH:mm:ss'
const User = db.user
const IncidentLog = db.incidentLog
const { Op } = require('sequelize')
const multer = require('multer')
const client = new elasticsearch.Client({
  node: process.env.HOST_ELAST,
  log: 'trace',
  apiVersion: '7.x', // use the same version of your Elasticsearch instance
  auth: {
    username: process.env.USER_ELAST,
    password: process.env.PASS_ELAST
  }
})
const path = process.env.resourcePath
const incidentIndex = 'gmtc_searcher'

async function getIncident (incidentId, id) {
  try {
    const actualIndexName = `${incidentIndex}_${id}`
    const incident = await client.get({
      index: actualIndexName,
      id: incidentId
    })
    return incident.body && incident.body._source ? incident.body._source : {}
  } catch (error) {
    return {}
  }
}

const storage = multer.diskStorage({
  // multers disk storage settings
  filename: function (req, file, cb) {
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

    jwt.verify(token, process.env.secret, (_err, decoded) => {
      const storagePath = `${path}incident/${decoded.id}/`

      if (!fs.existsSync(storagePath)) {
        fs.mkdirSync(storagePath, {
          recursive: true
        })
      }
      cb(null, storagePath)
    })
  }
})

const upImage = multer({
  // multer settings
  storage: storage
}).single('file')

exports.addIncident = (req, res) => {
  const token = req.headers['x-access-token']
  upImage(req, res, async function (err) {
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
        const reqBody = req.body
        if (!req.file) {
          return res.status(400).json({
            success: false,
            error_code: 1,
            message: 'Image is required'
          })
        }

        if (!reqBody.description || !reqBody.cameraName) {
          return res.status(400).json({
            success: false,
            error_code: 1,
            message: 'Description & Camera Name both are required'
          })
        }

        if (reqBody.time && !moment(reqBody.time, dateTimeFormat, true).isValid()) {
          return res.status(400).send({
            success: false,
            error_code: 1,
            message: `Invalid date format,pattern must be ${dateTimeFormat}`
          })
        }

        const decoded = await jwt.verify(token, process.env.secret)
        const actualIndexName = `${incidentIndex}_${decoded.id_account}`

        const data = {
          userId: decoded.id,
          time: reqBody.time ? moment.utc(reqBody.time).format() : moment.utc().format(),
          description: reqBody.description,
          cam_name: reqBody.cameraName,
          url: req.file
            ? `${process.env.app_url}/api/pictures/incident/${decoded.id}/${req.file.filename}`
            : null
        }

        const indexAlreadyExists = await client.indices.exists({
          index: actualIndexName
        })
        if (!indexAlreadyExists) {
          await client.indices.create({
            index: actualIndexName
          })
          console.log(actualIndexName, 'index created')
        }

        const incidentCreated = await client.index({
          index: actualIndexName,
          type: '_doc',
          body: data
        })

        if (!incidentCreated || incidentCreated.statusCode !== 201) {
          return res.status(400).json({
            success: false,
            error_code: 1,
            message: 'There have some problem to create new incident'
          })
        }

        const { body } = await client.get({
          index: actualIndexName,
          id: incidentCreated.body._id
        })

        res.status(200).send({
          success: true,
          message: 'Incident added successfully!',
          createdData: body
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

exports.addMemo = async (req, res) => {
  try {
    const token = req.headers['x-access-token']
    const { memo } = req.body
    if (!memo) {
      return res.status(400).json({
        success: false,
        error_code: 1,
        message: 'Memo is required'
      })
    }
    if (!req.params.id) {
      return res.status(400).json({
        success: false,
        error_code: 1,
        message: 'Incident id is required'
      })
    }

    const decoded = await jwt.verify(token, process.env.secret)
    const actualIndexName = `${incidentIndex}_${decoded.id_account}`

    client.get(
      {
        index: actualIndexName,
        id: req.params.id
      },
      async function (err, incident) {
        if (err || !incident || incident.statusCode !== 200) {
          return res.status(400).json({
            success: false,
            error_code: 1,
            message: 'Incident not found'
          })
        }

        const incidentLogData = {
          id: uuidv4(),
          incident_id: incident.body._id,
          user_id: decoded.id,
          logType: 'MEMO'
        }

        if (
          incident.body._source.memoDetails &&
          incident.body._source.memoDetails.userId &&
          incident.body._source.memoDetails.details
        ) {
          const userDetails = await User.findByPk(incident.body._source.memoDetails.userId)
          if (!userDetails) {
            return res.status(400).json({
              success: false,
              error_code: 1,
              message: 'User not found'
            })
          }
          incidentLogData.status = 'UPDATED'
          if (userDetails.role === 'client' && userDetails.id !== decoded.id) {
            incidentLogData.status = 'ERROR'
            await IncidentLog.create(incidentLogData)
            return res.status(400).json({
              success: false,
              error_code: 1,
              message: 'You are not authorized to update memo'
            })
          } else if (userDetails.role === 'branch') {
            if (!(decoded.id === userDetails.id || decoded.id === userDetails.id_account)) {
              incidentLogData.status = 'ERROR'
              await IncidentLog.create(incidentLogData)
              return res.status(400).json({
                success: false,
                error_code: 1,
                message: 'You are not authorized to update memo'
              })
            } else if (decoded.id === userDetails.id_account) {
              incidentLogData.status = 'WARNING'
            }
          } else if (userDetails.role === 'user') {
            if (
              !(
                decoded.id === userDetails.id ||
                decoded.id === userDetails.id_account ||
                decoded.id === userDetails.id_branch
              )
            ) {
              incidentLogData.status = 'ERROR'
              await IncidentLog.create(incidentLogData)
              return res.status(400).json({
                success: false,
                error_code: 1,
                message: 'You are not authorized to update memo'
              })
            } else if (
              decoded.id === userDetails.id_account ||
              decoded.id === userDetails.id_branch
            ) {
              incidentLogData.status = 'WARNING'
            }
          }
        }

        client.update(
          {
            index: actualIndexName,
            id: req.params.id,
            body: {
              doc: {
                memoDetails: {
                  userId: decoded.id,
                  details: memo
                }
              }
            }
          },
          async function (error, memoUpdated) {
            if (error || !memoUpdated || memoUpdated.statusCode !== 200) {
              return res.status(400).json({
                success: false,
                error_code: 1,
                message: 'Not able to update memo'
              })
            }

            await IncidentLog.create(incidentLogData)

            res.status(200).send({
              success: true,
              message: 'Memo updated successfully!'
            })
          }
        )
      }
    )
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error
    })
  }
}

exports.incidentDetails = async (req, res) => {
  try {
    const token = req.headers['x-access-token']
    if (!req.params.id) {
      return res.status(400).json({
        success: false,
        error_code: 1,
        message: 'Incident id is required'
      })
    }

    const decoded = await jwt.verify(token, process.env.secret)
    const actualIndexName = `${incidentIndex}_${decoded.id_account}`

    client.get(
      {
        index: actualIndexName,
        id: req.params.id
      },
      async function (err, incident) {
        if (err || !incident || incident.statusCode !== 200) {
          return res.status(400).json({
            success: false,
            error_code: 1,
            message: 'Incident not found'
          })
        }

        res.status(200).send({
          success: true,
          incidentDetails: incident.body
        })
      }
    )
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error
    })
  }
}

exports.incidentLogs = async (req, res) => {
  try {
    const token = req.headers['x-access-token']
    const decoded = await jwt.verify(token, process.env.secret)
    const userIdArray = []

    const users = await User.findAll({
      where: { id_account: decoded.id }
    })
    for (const user of users) {
      userIdArray.push(user.id)
    }

    const incidentLogs = await IncidentLog.findAll({
      where: {
        user_id: {
          [Op.in]: userIdArray
        }
      },
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: User,
          attributes: ['id', 'username', 'email', 'id_account', 'id_branch', 'role', 'createdAt']
        }
      ]
    })

    const responseArray = [...JSON.parse(JSON.stringify(incidentLogs))]

    for (let i = 0; i < responseArray.length; i++) {
      const incidentDetails = await getIncident(responseArray[i].incident_id, decoded.id_account)
      responseArray[i].incidentDetails = incidentDetails
    }

    res.status(200).send({
      success: true,
      logs: responseArray
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error
    })
  }
}

exports.manageBookmark = async (req, res) => {
  try {
    const token = req.headers['x-access-token']
    const reqBody = req.body
    if (!String(reqBody.bookMarked)) {
      return res.status(400).json({
        success: false,
        error_code: 1,
        message: 'Bookmark is required'
      })
    }
    if (!req.params.id) {
      return res.status(400).json({
        success: false,
        error_code: 1,
        message: 'Incident id is required'
      })
    }
    reqBody.bookMarked = String(reqBody.bookMarked) === 'true'
    console.log(reqBody)
    const decoded = await jwt.verify(token, process.env.secret)
    const actualIndexName = `${incidentIndex}_${decoded.id_account}`

    client.get(
      {
        index: actualIndexName,
        id: req.params.id
      },
      async function (err, incident) {
        if (err || !incident || incident.statusCode !== 200) {
          return res.status(400).json({
            success: false,
            error_code: 1,
            message: 'Incident not found'
          })
        }

        const incidentLogData = {
          id: uuidv4(),
          incident_id: incident.body._id,
          user_id: decoded.id,
          logType: 'BOOKMARK'
        }

        if (
          incident.body._source.bookmarkDetails &&
          incident.body._source.bookmarkDetails.userId &&
          String(incident.body._source.bookmarkDetails.isBookMarked)
        ) {
          const userDetails = await User.findByPk(incident.body._source.bookmarkDetails.userId)
          if (!userDetails) {
            return res.status(400).json({
              success: false,
              error_code: 1,
              message: 'User not found'
            })
          }
          incidentLogData.status = 'UPDATED'
          if (userDetails.role === 'client' && userDetails.id !== decoded.id) {
            incidentLogData.status = 'ERROR'
            await IncidentLog.create(incidentLogData)
            return res.status(400).json({
              success: false,
              error_code: 1,
              message: 'You are not authorized to update bookmark'
            })
          } else if (userDetails.role === 'branch') {
            if (!(decoded.id === userDetails.id || decoded.id === userDetails.id_account)) {
              incidentLogData.status = 'ERROR'
              await IncidentLog.create(incidentLogData)
              return res.status(400).json({
                success: false,
                error_code: 1,
                message: 'You are not authorized to update bookmark'
              })
            } else if (decoded.id === userDetails.id_account) {
              incidentLogData.status = 'WARNING'
            }
          } else if (userDetails.role === 'user') {
            if (
              !(
                decoded.id === userDetails.id ||
                decoded.id === userDetails.id_account ||
                decoded.id === userDetails.id_branch
              )
            ) {
              incidentLogData.status = 'ERROR'
              await IncidentLog.create(incidentLogData)
              return res.status(400).json({
                success: false,
                error_code: 1,
                message: 'You are not authorized to update bookmark'
              })
            } else if (
              decoded.id === userDetails.id_account ||
              decoded.id === userDetails.id_branch
            ) {
              incidentLogData.status = 'WARNING'
            }
          }
        }

        client.update(
          {
            index: actualIndexName,
            id: req.params.id,
            body: {
              doc: {
                bookmarkDetails: {
                  userId: decoded.id,
                  isBookMarked: reqBody.bookMarked
                }
              }
            }
          },
          async function (error, bookMarkUpdated) {
            if (error || !bookMarkUpdated || bookMarkUpdated.statusCode !== 200) {
              return res.status(400).json({
                success: false,
                error_code: 1,
                message: 'Not able to update bookmark'
              })
            }

            await IncidentLog.create(incidentLogData)

            res.status(200).send({
              success: true,
              message: reqBody.bookMarked
                ? 'Incident bookmarked successfully!'
                : 'Incident removed from bookmark successfully!'
            })
          }
        )
      }
    )
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error
    })
  }
}

exports.incidentsWithTimeline = async (req, res) => {
  try {
    const token = req.headers['x-access-token']
    const reqBody = req.body
    if (!reqBody.start || !reqBody.end) {
      return res.status(400).json({
        success: false,
        error_code: 1,
        message: 'Start date and End date both is required!'
      })
    }

    if (
      !moment(reqBody.start, dateTimeFormat, true).isValid() ||
      !moment(reqBody.end, dateTimeFormat, true).isValid()
    ) {
      return res.status(400).send({
        success: false,
        error_code: 1,
        message: `Invalid date format,pattern must be ${dateTimeFormat}`
      })
    }

    const decoded = await jwt.verify(token, process.env.secret)
    const actualIndexName = `${incidentIndex}_${decoded.id_account}`

    const params = {
      index: [actualIndexName],
      body: {
        size: 10000,
        sort: [{ time: { order: 'asc' } }],
        query: {
          bool: {
            must: [
              {
                range: {
                  time: {
                    gte: moment.utc(reqBody.start).format(),
                    lte: moment.utc(reqBody.end).format()
                  }
                }
              }
            ]
          }
        }
      }
    }

    const indexAlreadyExists = await client.indices.exists({
      index: actualIndexName
    })
    let result
    if (indexAlreadyExists.statusCode === 200) {
      result = await client.search(params)
    }

    const responseData = {
      success: true,
      total: result ? result.body.hits.total.value : 0,
      incidents: result ? result.body.hits.hits : []
    }
    res.status(200).send(responseData)
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error
    })
  }
}
