const elasticsearch = require('elasticsearch')
require('dotenv').config({
  path: '../../config.env'
})
const jwt = require('jsonwebtoken')
const fs = require('fs')
const db = require('../models')
const Camera = db.camera
const { v4: uuidv4 } = require('uuid')
const client = new elasticsearch.Client({
  host: `https://${process.env.USER_ELAST}:${process.env.PASS_ELAST}@search-graymatics-dev-fc6j24xphhun5xcinuusz2yfjm.ap-southeast-1.es.amazonaws.com`,
  log: 'trace',
  apiVersion: '7.x' // use the same version of your Elasticsearch instance
})
const { Op } = require('sequelize')
const con = require('../models/dbmysql')
const path =
  process.env.home + process.env.username + process.env.pathDocker + process.env.resources
const multer = require('multer')
const AWS = require('aws-sdk')
const s3 = new AWS.S3({
  accessKeyId: process.env.ACCESSKEY,
  secretAccessKey: process.env.SECRETKEY
})

exports.ping = async (req, res) => {
  client.ping(
    {
      // ping usually has a 3000ms timeout
      requestTimeout: 30000
    },
    function (error) {
      if (error) {
        console.trace('elasticsearch cluster is down!')
        console.error(error)
        res.status(500).json({
          success: false,
          mess: error
        })
      } else {
        console.log('All is well')
        res.status(200).json({
          success: true
        })
      }
    }
  )
}

exports.search = async (req, res) => {
  try {
    const body = await client.search({
      q: req.params.query
    })
    const hits = body.hits.hits
    res.status(200).json({
      success: true,
      data: hits
    })
  } catch (error) {
    console.trace(error.message)
    res.status(500).json({
      success: false,
      mess: error
    })
  }
}

const stor = multer.diskStorage({
  // multers disk storage settings
  filename: function (req, file, cb) {
    const format = file.originalname.split('.')[1]
    const newName = file.originalname.split('.')[0] + '-' + Date.now() + '.' + format
    cb(null, newName)
  },
  destination: function (req, file, cb) {
    const token = req.headers['x-access-token']

    jwt.verify(token, process.env.secret, (_err, decoded) => {
      const where = `${path}${decoded.id_account}/${decoded.id_branch}/videos/`
      if (!fs.existsSync(where)) {
        fs.mkdirSync(where)
      }
      cb(null, where)
    })
  }
})
const upVideo = multer({
  // multer settings
  storage: stor
}).single('file')

exports.upload = (req, res) => {
  const uuid = uuidv4()
  const token = req.headers['x-access-token']
  upVideo(req, res, function (err) {
    if (err) {
      return res.status(500).json({
        success: false,
        error_code: 1,
        err_desc: err
      })
    } else {
      if (!req.file) {
        return res.status(500).json({
          success: false,
          error_code: 1
        })
      }
      // res.status(200).json({ success: true, name: req.file.filename });
      jwt.verify(token, process.env.secret, async (_err, decoded) => {
        // Save User to Database
        Camera.create({
          id: uuid,
          name: req.file.originalname.split('.')[0].split('_').join(' '),
          rtsp_in: req.file.path,
          http_in: `${process.env.app_url}/api/pictures/${decoded.id_account}/${decoded.id_branch}/videos/${req.file.filename}`,
          id_account: decoded.id_account,
          id_branch: decoded.id_branch,
          stored_vid: 'Yes'
        })
          .then(camera => {
            res.status(200).send({
              success: true,
              message: 'Stored video added successfully!',
              id: uuid,
              name: req.file.originalname.split('.')[0]
            })
          })
          .catch(err => {
            console.log('Error while uploading..............', err)
            res.status(500).send({
              success: false,
              message: err.message
            })
          })
      })
    }
  })
}

exports.s3up = (req, res) => {
  const uuid = uuidv4()
  const token = req.headers['x-access-token']

  const myFile = req.file.originalname.split('.')
  const format = myFile[myFile.length - 1]
  const newName = req.file.originalname.split('.')[0] + '-' + Date.now() + '.' + format

  jwt.verify(token, process.env.secret, async (_err, decoded) => {
    const params = {
      Bucket: process.env.BUCKET_S3,
      Key: `${decoded.id_account}/${decoded.id_branch}/${newName}`,
      Body: req.file.buffer
    }

    s3.upload(params, (error, data) => {
      if (error) {
        return res.status(500).send({ success: false, mess: error })
      }
      Camera.create({
        id: uuid,
        name: req.file.originalname.split('.')[0],
        rtsp_in: newName,
        http_in: newName,
        id_account: decoded.id_account,
        id_branch: decoded.id_branch,
        stored_vid: 's3'
      })
        .then(camera => {
          res.status(200).send({
            success: true,
            message: 'Stored video added successfully!',
            id: uuid,
            name: req.file.originalname.split('.')[0]
          })
        })
        .catch(err => {
          console.log('Error while uploading..............', err)
          res.status(500).send({
            success: false,
            message: err.message
          })
        })
    })
  })
}

exports.viewVids = async (req, res) => {
  const token = req.headers['x-access-token']

  jwt.verify(token, process.env.secret, async (_err, decoded) => {
    Camera.findAll({
      where: {
        id_branch: decoded.id_branch,
        stored_vid: 'Yes'
      },
      attributes: ['name', 'id', 'createdAt', 'updatedAt', 'rtsp_in', 'stored_vid']
    })
      .then(cameras => {
        res.status(200).send({
          success: true,
          data: cameras
        })
      })
      .catch(err => {
        res.status(500).send({
          success: false,
          message: err.message
        })
      })
  })
}

exports.delVid = (req, res) => {
  const token = req.headers['x-access-token']
  const data = req.body
  jwt.verify(token, process.env.secret, async (_err, decoded) => {
    if (data.which === 'local') {
      // const vid = `${process.env.app_url}/api/pictures/${decoded.id_account}/${decoded.id_branch}/videos/${data.vidName}`
      // const img = `${process.env.app_url}/api/pictures/${decoded.id_account}/${decoded.id_branch}/heatmap_pics/${req.params.id}_heatmap.png`
      const vid = `${path}${decoded.id_account}/${decoded.id_branch}/videos/${data.vidName}`
      const img = `${path}${decoded.id_account}/${decoded.id_branch}/heatmap_pics/${req.params.id}_heatmap.png`
      fs.unlink(img, err => {
        if (err) console.log({ success: false, message: 'Image error: ' + err })
      })
      fs.unlink(vid, err => {
        if (err) console.log({ success: false, message: 'Image error: ' + err })
      })
    } else if (data.which === 's3') {
      const params = {
        Bucket: process.env.BUCKET_S3,
        Key: `${decoded.id_account}/${decoded.id_branch}/${req.body.vidName}`
      }
      s3.deleteObject(params, function (err, data) {
        if (err) return res.status(500).json({ success: false, mess: err })
      })
    }
    console.log('Debug Data : ', data)

    Camera.destroy({
      where: { id: data.uuid, id_branch: decoded.id_branch, stored_vid: 'Yes' }
    })
      .then(cam => {
        res.status(200).send({ success: true, camera: data.uuid })
      })
      .catch(err => {
        console.log('err............', err)
        res.status(500).send({
          success: false,
          message: err.message
        })
      })
  })
}

exports.editVid = (req, res) => {
  const updt = req.body
  const token = req.headers['x-access-token']

  jwt.verify(token, process.env.secret, async (_err, decoded) => {
    Camera.update(updt, {
      where: { id: req.params.id, id_branch: decoded.id_branch, stored_vid: 'Yes' }
    })
      .then(_cam => {
        res.status(200).send({ success: true, data: updt })
      })
      .catch(err => {
        res.status(500).send({ success: false, message: err.message })
      })
  })
}

exports.some = async (req, res) => {
  const table = 'intrude'
  client.cluster.health({}, async function (_err, resp, status) {
    console.log('-- Client Health --', resp)
    try {
      const r = await deleteIndex(table)
      res.status(200).json({ success: true, data: r })
    } catch (err) {
      res.status(500).json({ success: false, mess: err })
    }
  })
}

async function deleteIndex (table) {
  client.indices.delete({ index: table }, async function (_err, resp, status) {
    console.log('delete', resp)
    await createIndex(table)
  })
}
async function createIndex (table) {
  client.indices.create(
    {
      index: table
    },
    async function (err, resp, status) {
      if (err) {
        console.log(err)
      } else {
        // console.log('create', resp)
        await readMysql(table)
      }
    }
  )
}

async function readMysql (table) {
  const sql = 'select * from ' + table + ';'
  con.con().query(sql, async function (err, result) {
    if (err) throw err
    console.log(result.length)
    result.forEach(async o => {
      const jsonStr = JSON.stringify(o)
      await saveToES(jsonStr, table)
    })

    setTimeout(printHourlyData, 10000)
    setTimeout(printDailyData, 10000)
    // pringData('day');
  })
}

function saveToES (o, table) {
  client.index(
    {
      index: table,
      type: 'alerts',
      body: o
    },
    function (_err, resp, status) {
      return resp
    }
  )
}

function printHourlyData () {
  printData('hour')
}

function printDailyData () {
  printData('day')
}

function printData (interval, table) {
  client.search(
    {
      index: table,
      type: 'alerts',
      body: {
        aggs: {
          simpleDatehHistogram: {
            date_histogram: {
              field: 'time',
              interval: interval
            }
          }
        }
      }
    },
    function (error, response, status) {
      if (error) {
        console.log('search error: ' + error)
      } else {
        console.log(
          '================================ Data by ' +
            interval +
            '============================================'
        )
        response.aggregations.simpleDatehHistogram.buckets.forEach(function (hit) {
          console.log(hit)
        })
      }
    }
  )
}

exports.loit = async (req, res) => {
  const interval = 'day'
  const table = 'loitering'
  try {
    const search = await client.search({
      index: table,
      type: 'alerts',
      body: {
        aggs: {
          simpleDatehHistogram: {
            date_histogram: {
              field: 'time',
              interval: interval
            }
          }
        }
      }
    })
    res.status(200).json({ success: true, data: search.aggregations.simpleDatehHistogram.buckets })
  } catch (err) {
    res.status(500).json({ success: false, mess: err })
  }
}
