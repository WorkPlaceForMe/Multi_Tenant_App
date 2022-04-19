require('dotenv').config({ path: '../../../config.env' })
const jwt = require('jsonwebtoken')
const db = require('../models/dbmysql')

exports.getAllHm = (req, res) => {
  const token = req.headers['x-access-token']

  jwt.verify(token, process.env.secret, (_err, _decoded) => {
    db.con().query(
      "SELECT DATE_FORMAT(timestamp,'%d/%m/%y %H:%i') as date, x, y FROM heatmap where cam_id = ?;",
      [req.params.id],
      function (err, result) {
        if (err) return res.status(500).json({ success: false, message: err })
        res.status(200).json({ success: true, data: result })
      }
    )
  })
}

exports.getHm = (req, res) => {
  const token = req.headers['x-access-token']
  jwt.verify(token, process.env.secret, (_err, _decoded) => {
    db.con().query(
      "SELECT DATE_FORMAT(timestamp,'%d/%m/%y %H:%i') as date, x, y, dwell FROM heatmap where timestamp >= ? and  timestamp <= ? and cam_id = ? order by date asc;",
      [req.params.st, req.params.end, req.params.id],
      function (err, result) {
        if (err) return res.status(500).json({ success: false, message: err })
        res.status(200).json({ success: true, data: result })
      }
    )
  })
}

exports.test = (req, res) => {
  const token = req.headers['x-access-token']

  jwt.verify(token, process.env.secret, (_err, _decoded) => {
    db.con().query(
      "SELECT DATE_FORMAT(timestamp,'%d/%m/%y %H:%i') as date, x, y FROM heatmap where cam_id = '27c30a23-2751-4c0d-bef2-95e993648dd4';",
      function (err, result) {
        if (err) return res.status(500).json({ success: false, message: err })
        res.status(200).json({ success: true, data: result })
      }
    )
  })
}
