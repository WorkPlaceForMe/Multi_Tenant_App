const db = require('../models')
require('dotenv').config({ path: '../../config.env' })
const { v4: uuidv4 } = require('uuid')
const fs = require('fs')
const ExifImage = require('exif').ExifImage
const cp = require('child_process')
const jwt = require('jsonwebtoken')
const path =
  process.env.home + process.env.username + process.env.pathDocker + process.env.resources

exports.imageUp = (req, res) => {
  let base64 = req.body.base64
  base64 = base64.split(';base64,').pop()
  const name = `${uuidv4()}.${req.body.format}`

  const token = req.headers['x-access-token']

  jwt.verify(token, process.env.secret, async (err, decoded) => {
    const pathPic = `${path}${decoded.id_account}/${decoded.id_branch}/pictures/${req.params.uuid}`

    try {
      fs.writeFile(`${pathPic}/${name}`, base64, 'base64', function (err) {
        try {
          new ExifImage({ image: `${pathPic}/${name}` }, function (error, exifData) {
            if (error) {
              res
                .status(200)
                .send({
                  success: true,
                  message: 'Image error: ' + error.message + '. But was uploaded',
                  name: name
                })
            } else if (exifData.image.Orientation == 6) {
              const form = name.split('.')
              cp.exec(
                'ffmpeg -y -i ' +
                  pathPic +
                  '/' +
                  form[0] +
                  '.' +
                  form[1] +
                  ' -vf transpose=1 ' +
                  pathPic +
                  '/' +
                  form[0] +
                  '_1.' +
                  form[1],
                function (err, data) {
                  console.log('err: ', err)
                  console.log('data: ', data)
                  fs.unlink(pathPic + '/' + form[0] + '.' + form[1], err => {
                    if (err) res.send(err)
                    res
                      .status(200)
                      .send({ success: true, message: 'Image added and transposed!', name: name })
                  })
                }
              )
            } else {
              res.status(200).send({ success: true, message: 'Image added!', name: name })
            }
          })
        } catch (error) {
          res
            .status(500)
            .send({ success: false, message: 'Image error: ' + error.message, name: name })
        }
      })
    } catch (error) {
      res.status(500).send({ success: false, message: 'Image error: ' + error.message, name: name })
    }
  })
}

exports.delImg = (req, res) => {
  const user_id = req.body.user_id
  const name = req.body.imageName
  const token = req.headers['x-access-token']

  jwt.verify(token, process.env.secret, async (err, decoded) => {
    const img = `${path}${decoded.id_account}/${decoded.id_branch}/pictures/${user_id}/${name}`
    fs.unlink(img, err => {
      if (err) res.status(500).send({ success: false, message: 'Image error: ' + err, name: name })
      else {
        res.status(200).send({ success: true, message: 'Image deleted', name: name })
      }
    })
  })
}

exports.readImgs = (req, res) => {
  const arreglo = []
  const id = req.params.uuid

  const token = req.headers['x-access-token']

  jwt.verify(token, process.env.secret, async (err, decoded) => {
    const files = fs.readdirSync(`${path}${decoded.id_account}/${decoded.id_branch}/pictures/${id}`)
    for (let i = 0; i < files.length; i++) {
      const fileName = `${path}${decoded.id_account}/${decoded.id_branch}/pictures/${id}/${files[i]}`
      const file = fs.statSync(fileName)
      if (file.isFile()) {
        if (
          files[i].includes('.jpg') ||
          files[i].includes('.png') ||
          files[i].includes('.JPG') ||
          files[i].includes('.jpeg') ||
          files[i].includes('.PNG')
        ) {
          arreglo.push({ name: files[i] })
        }
      }
    }
    res.status(200).json({ success: true, data: arreglo })
  })
}
