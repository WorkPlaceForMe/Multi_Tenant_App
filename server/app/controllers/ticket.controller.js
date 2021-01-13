require('dotenv').config({ path: '../../config.env'});
var jwt = require("jsonwebtoken");
var db=require('../models/dbmysql');


exports.getAll = (req, res) =>{
    let token = req.headers["x-access-token"];
    const data = req.body
    jwt.verify(token, process.env.secret, (err, decoded) => {
       db.con().query(`SELECT * FROM tickets WHERE ${data.type} = '${data.id}' LIMIT 500;`, function (err, result) {
        if (err) return res.status(500).json({success: false, message: err});
        res.status(200).json({success: true, data: result})
      });
  })
}

exports.countTypes = async (req, res) =>{
  const data = req.body
  await db.con().query(`SELECT type, count(type) as count FROM multi_tenant.tickets WHERE createdAt >= '${data.start}' and  createdAt <= '${data.end}' group by type;`, function (err, result) {
    if (err) return res.status(500).json({success: false, message: err});
    const response = {
      count: result,
    }
    res.status(200).json({success: true, data: response})
  });
}

exports.getPeriod = async (req, res) =>{
  const data = req.body
     await db.con().query(`SELECT * FROM tickets WHERE createdAt >= '${data.start}' and  createdAt <= '${data.end}' order by createdAt desc;`, function (err, result) {
      if (err) return res.status(500).json({success: false, message: err});

      const response = {
        raw: result,
      }
      res.status(200).json({success: true, data: response})
    });

}

exports.check = (req, res) =>{
    let d = new Date();
    const data = req.body;
   var date = d.getFullYear()  + "-" + (d.getMonth()+1) + "-" + d.getDate() + " " + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
      if(data.user == null){
        date = data.date
        date = new Date(date)
        date = date.getFullYear()  + "-" + (date.getMonth()+1) + "-" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
      }
        db.con().query(`UPDATE tickets set updatedAt = '${date}', reviewed = '${data.user}' where id = '${req.params.id}';`, function (err, result) {
        if (err) return res.status(500).json({success: false, message: err});
        res.status(200).json({success: true, data: result})
      });
}

exports.assign = (req, res) =>{
    const data = req.body;
        db.con().query(`UPDATE tickets set assigned= '${data.assigned}', assignedBy= '${data.assignedBy}' where id = '${req.params.id}';`, function (err, result) {
        if (err) return res.status(500).json({success: false, message: err});
        res.status(200).json({success: true, data: result})
      });
}
