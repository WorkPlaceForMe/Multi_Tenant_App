const db = require('../models/dbmysql')

exports.getAllPath = (req, res) => {
  db.con().query(
    "SELECT DATE_FORMAT(timestamp,'%d/%m/%y %H:%i') as date, x, y, id FROM heatmap where cam_id = ?;",
    [req.params.id],
    function (err, result) {
      if (err) return res.status(500).json({ success: false, message: err })
      res.status(200).json({ success: true, data: result })
    }
  )
}

exports.getPath = (req, res) => {
  db.con().query(
    "SELECT DATE_FORMAT(timestamp,'%d/%m/%y %H:%i') as date, x, y, id FROM heatmap where timestamp >= ? and  timestamp <= ? and cam_id = ? order by date asc;",
    [req.params.st, req.params.end, req.params.id],
    function (err, result) {
      if (err) return res.status(500).json({ success: false, message: err })
      res.status(200).json({ success: true, data: result })
    }
  )
}
