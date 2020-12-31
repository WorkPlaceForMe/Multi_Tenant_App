require('dotenv').config({ path: '../../config.env'});
var jwt = require("jsonwebtoken");
var db=require('../models/dbmysql');


exports.getAll = (req, res) =>{
    let token = req.headers["x-access-token"];
    const data = req.body
    jwt.verify(token, process.env.secret, (err, decoded) => {
       db.con().query(`SELECT * FROM tickets WHERE ${data.type} = '${data.id}';`, function (err, result) {
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
  var count = {};
  var label = [];
  var histoIntr = {};
  var histoAod = {};
  var histoLoit = {};
     await db.con().query(`SELECT * FROM tickets WHERE createdAt >= '${data.start}' and  createdAt <= '${data.end}' order by createdAt asc;`, function (err, result) {
      if (err) return res.status(500).json({success: false, message: err});
      for(var i of result){
        count[i.type] = (count[i.type] || 0) + 1;
        switch(i.type){
          case 'intrusion':{
            histoIntr[i.createdAt.getUTCHours()] = (histoIntr[i.createdAt.getUTCHours()] || 0) + 1;
            break;
          }
          case 'aod':{
            histoAod[i.createdAt.getUTCHours()] = (histoAod[i.createdAt.getUTCHours()] || 0) + 1;
            break;
          }
          case 'loitering':{
            histoLoit[i.createdAt.getUTCHours()] = (histoLoit[i.createdAt.getUTCHours()] || 0) + 1;
            break;
          }
          case 'no mask':{
            histoIntr[i.createdAt.getUTCHours()] = (histoIntr[i.createdAt.getUTCHours()] || 0) + 1;
            break;
          }
        }
        label.push(i.createdAt)
      }


      const response = {
        count: count,
        raw: result,
        label: label,
        histograms: {
          intrusion: histoIntr,
          aod: histoAod,
          loitering: histoLoit
        }
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
