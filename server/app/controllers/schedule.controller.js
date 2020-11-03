const db = require("../models");
require('dotenv').config({ path: '../../config.env'});
var jwt = require("jsonwebtoken");
const Schedule = db.user;

exports.getSched = (req,res) => {
    Schedule.findAll({
      where: { user_id: req.params.id }
    }).then(sched => {
        res.status(200).send({ success: true, data:sched });
    }).catch(err => {
      res.status(500).send({ message: err.message });
    });
  };

exports.createSched = (req, res) =>{
        let token = req.headers["x-access-token"];
        const sched = req.body;
      
        jwt.verify(token, process.env.secret, (err, decoded) => {
        Schedule.create({
          user_id: sched.user_id,
          day: sched.day,
          entrance: sched.entrance,
          leave_time: sched.leave_time,
          id_account: decoded.id_account,
          id_branch: decoded.id_branch
        })
          .then(user => {
                res.status(200).send({ success: true, message: "Schedule was registered successfully!" });
          })
          .catch(err => {
            res.status(500).send({ success:false, message: err.message });
          });
        })
      };

    exports.deleteSched = (req,res) => {
    Schedule.destroy({
        where: {  user_id: req.params.id  }
    }).then(rel => {
        res.status(200).send({ success: true, rel:req.params.id });
    }).catch(err => {
        res.status(500).send({ success:false, message: err.message });
    });
    };

    exports.editSched = (req,res) => {
    var updt = req.body
    Schedule.update(updt,{
        where: { user_id: req.params.id, day:updt.day  }
    }).then(user => {
        res.status(200).send({ success: true, data:updt });
    }).catch(err => {
        res.status(500).send({success:false, message: err.message });
    });
    };
      