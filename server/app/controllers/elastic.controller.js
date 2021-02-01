const elasticsearch = require('elasticsearch')
require('dotenv').config({ path: '../../config.env' })
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
const path = process.env.home + process.env.username + process.env.pathDocker + process.env.resources
const multer = require('multer')

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
        res.status(500).json({ success: false, mess: error })
      } else {
        console.log('All is well')
        res.status(200).json({ success: true })
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
    res.status(200).json({ success: true, data: hits })
  } catch (error) {
    console.trace(error.message)
    res.status(500).json({ success: false, mess: error })
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
      return res.status(500).json({ success: false, error_code: 1, err_desc: err })
    } else {
      if (!req.file) {
        return res.status(500).json({ success: false, error_code: 1 })
      }
      // res.status(200).json({ success: true, name: req.file.filename });
      jwt.verify(token, process.env.secret, async (_err, decoded) => {
        // Save User to Database
        Camera.create({
          id: uuid,
          name: req.file.originalname.split('.')[0],
          rtsp_in: process.env.app_url + req.file.path,
          http_in: process.env.app_url + req.file.path,
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
            console.log('Error while uploading..............', err);
            res.status(500).send({
              success: false,
              message: err.message
            })
          })
      })
    }
  })
}

exports.viewVids = async (req, res) => {
  const arreglo = []
  const token = req.headers['x-access-token']

  jwt.verify(token, process.env.secret, async (err, decoded) => {
    Camera.findAll({
      where: {
        id_branch: decoded.id_branch,
        stored_vid: 'Yes'
      },
      attributes: ['name', 'id', 'createdAt', 'updatedAt', 'rtsp_in']
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
  const name = req.body.vidName;

  const token = req.headers['x-access-token']

  jwt.verify(token, process.env.secret, async (_err, decoded) => {
    /* const vid = `${path}${decoded.id_account}/${decoded.id_branch}/videos/${name}`
    const img = `${path}${decoded.id_account}/${decoded.id_branch}/heatmap_pics/${req.params.id}_heatmap.png`
    fs.unlink(img, err => {
      if (err) console.log({ success: false, message: 'Image error: ' + err })
    })
    fs.unlink(vid, err => {
      if (err) console.log({ success: false, message: 'Image error: ' + err })
    }) */

    Camera.destroy({
      where: { id: req.params.id, id_branch: decoded.id_branch, stored_vid: 'Yes' }
    })
      .then(cam => {
        res.status(200).send({ success: true, camera: req.params.uuid })
      })
      .catch(err => {
        res.status(500).send({ success: false, message: err.message })
      })
  })
  /* const token = req.headers['x-access-token']

  jwt.verify(token, process.env.secret, async (_err, decoded) => {
    const img = `${path}${decoded.id_account}/${decoded.id_branch}/videos/${name}`
    fs.unlink(img, err => {
      if (err) res.status(500).send({ success: false, message: 'Image error: ' + err, name: name })
      else {
        res.status(200).send({ success: true, message: 'Image deleted', name: name })
      }
    })
  }) */
}

exports.editVid = (req,res) => {
  var updt = req.body;
  let token = req.headers["x-access-token"];

  jwt.verify(token, process.env.secret, async (err, decoded) => {
  Camera.update(updt,{
    where: {   id: req.params.id, id_branch: decoded.id_branch, stored_vid: 'Yes'  },
  }).then(cam => {
      res.status(200).send({ success: true, data: updt });
  }).catch(err => {
    res.status(500).send({ success: false, message: err.message });
  });
  })
};
