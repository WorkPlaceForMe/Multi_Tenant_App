require('dotenv').config({ path: '../../config.env'});
var jwt = require("jsonwebtoken");
var db=require('../models/dbmysql');


exports.getAllHm = (req, res) =>{
    let token = req.headers["x-access-token"];

    jwt.verify(token, process.env.secret, (err, decoded) => {
       db.con().query("SELECT DATE_FORMAT(timestamp,'%d/%m/%y %H:%i') as date, x, y FROM heatmap where cam_id = ?;",[req.params.id], function (err, result) {
        if (err) return res.status(500).json({success: false, message: err});
        res.status(200).json({success: true, data: result})
      });
  })
}

exports.getHm = (req, res) =>{
    let token = req.headers["x-access-token"];
    jwt.verify(token, process.env.secret, (err, decoded) => {
        db.con().query("SELECT DATE_FORMAT(timestamp,'%d/%m/%y %H:%i') as date, x, y, dwell FROM heatmap where timestamp >= ? and  timestamp <= ? and cam_id = ? order by date asc;",[req.params.st, req.params.end, req.params.id], function (err, result) {
        if (err) return res.status(500).json({success: false, message: err});
        res.status(200).json({success: true, data: result})
      });
  })
}
