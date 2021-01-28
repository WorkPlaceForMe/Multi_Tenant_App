const elasticsearch = require('elasticsearch')
require('dotenv').config({ path: '../../config.env' })
const jwt = require('jsonwebtoken')
const fs = require('fs')
const client = new elasticsearch.Client({
  host: `https://${process.env.USER_ELAST}:${process.env.PASS_ELAST}@search-graymatics-dev-fc6j24xphhun5xcinuusz2yfjm.ap-southeast-1.es.amazonaws.com`,
  log: 'trace',
  apiVersion: '7.x' // use the same version of your Elasticsearch instance
})
const path =
  process.env.home + process.env.username + process.env.pathDocker + process.env.resources
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
  upVideo(req, res, function (err) {
    if (err) {
      return res.status(500).json({ success: false, error_code: 1, err_desc: err })
    } else {
      if (!req.file) {
        return res.status(500).json({ success: false, error_code: 1 })
      }
      res.status(200).json({ success: true, name: req.file.filename })
    }
  })
}

exports.viewVids = async (req, res) => {
  const arreglo = []
  const token = req.headers['x-access-token']

  jwt.verify(token, process.env.secret, async (_err, decoded) => {
    const files = fs.readdirSync(`${path}${decoded.id_account}/${decoded.id_branch}/videos/`)
    for (let i = 0; i < files.length; i++) {
      const fileName = `${path}${decoded.id_account}/${decoded.id_branch}/videos/${files[i]}`
      const file = fs.statSync(fileName)
      if (file.isFile()) {
        if (files[i].includes('.mp4') || files[i].includes('.mov')) {
          arreglo.push({
            name: files[i].split('-')[0].split('_').join(' '),
            file: files[i],
            id: files[i].split('-')[1].split('.')[0]
          })
        }
      }
    }
    res.status(200).json({ success: true, data: arreglo })
  })
}

exports.delVid = (req, res) => {
  const name = req.body.vidName
  const token = req.headers['x-access-token']

  jwt.verify(token, process.env.secret, async (_err, decoded) => {
    const img = `${path}${decoded.id_account}/${decoded.id_branch}/videos/${name}`
    fs.unlink(img, err => {
      if (err) res.status(500).send({ success: false, message: 'Image error: ' + err, name: name })
      else {
        res.status(200).send({ success: true, message: 'Image deleted', name: name })
      }
    })
  })
}
