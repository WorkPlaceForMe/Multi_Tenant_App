const db = require("../models");
require('dotenv').config({ path: '../../config.env'});
var jwt = require("jsonwebtoken");
const Cameras = db.camera;
const Relation = db.relation;
const Algorithm = db.algorithm;
const User = db.user;

exports.getRels = (req,res) => {
    Relation.findAll({
      where: { camera_id: req.params.id }
    }).then(rels => {
        res.status(200).send({ success: true, data:rels });
    }).catch(err => {
      res.status(500).send({ success:false, message: err.message });
    });
  };

exports.getAll = (req, res) =>{
    let token = req.headers["x-access-token"];

    jwt.verify(token, process.env.secret, (err, decoded) => {
        Relation.findAll({
            where: { id_branch: decoded.id_branch }
          }).then(rels => {
              res.status(200).send({ success: true, data:rels });
          }).catch(err => {
            res.status(500).send({ success:false, message: err.message });
          });
      });
}

exports.createRel = (req, res) =>{
        let token = req.headers["x-access-token"];
        const rel = req.body;
      
        jwt.verify(token, process.env.secret, (err, decoded) => {
        Relation.create({
          camera_id: rel.camera_id,
          algo_id: rel.algo_id,
          roi_id: rel.roi_id,
          atributes: rel.atributes,
          id_account: decoded.id_account,
          id_branch: decoded.id_branch
        })
          .then(user => {
                res.status(200).send({ success: true, message: "Relation was registered successfully!" });
          })
          .catch(err => {
            res.status(500).send({ success:false, message: err.message });
          });
        })
      };

    exports.deleteRel = (req,res) => {
    Relation.destroy({
        where: {  id: req.params.id  }
    }).then(rel => {
        res.status(200).send({ success: true, rel:req.params.id });
    }).catch(err => {
        res.status(500).send({ success:false, message: err.message });
    });
    };

    exports.editRel = (req,res) => {
    var updt = req.body
    console.log(updt)
    Relation.update(updt,{
        where: { id: req.params.id  }
    }).then(user => {
        res.status(200).send({ success: true, data:updt });
    }).catch(err => {
        res.status(500).send({success:false, message: err.message });
    });
    };
      
    exports.configs = (req,res) =>{
      let token = req.headers["x-access-token"];
      let inf = req.body
      const id = req.params.id
      var count = 0;
      jwt.verify(token, process.env.secret, (err, decoded) => {
      User.findOne({
        where: {
          id: decoded.id_account
        }
      }).then(user=>{
        Relation.findAll({
          where: { camera_id: id }
        }).then(rels => {
          for(var a of inf[0]){
            var stuff = [];
            var confStuff = {};
            var upAdd = 1;
            if(a.activated == true && a.id != 4 && a.id != 8){
                count++;
                confStuff['conf'] = a.conf
                confStuff['save'] = a.save
                confStuff['time'] = a.time
                stuff.push(confStuff)
                if(a.id == 1){
                    stuff.push(inf[1])
                }
                if(a.id == 2){
                    stuff.push(inf[2])
                }
                if(a.id == 16){
                    stuff.push(inf[3])
                }
                if(a.id == 5){
                    stuff.push(inf[4])
                }
                if(a.id == 7){
                    stuff.push(inf[5])
                }
                if(a.id == 3){
                    stuff.push(inf[6])
                }
                if(a.id == 12){
                    stuff.push(inf[7])
                }
                for(var rela of rels){
                    if(rela.algo_id == a.id){
                        if(rela.atributes != JSON.stringify(stuff)){
                            upAdd = 2;
                            if(stuff.hasOwnProperty('atributes')){
                              stuff.atributes = stuff.atributes
                            }
                            let atr = {
                              atributes: stuff
                            }
                            Relation.update(atr,{
                                where: { id: rela.id  }
                            })
                        }else{
                            upAdd = 0;
                        }
                    }
                }
                if(upAdd == 1){
                  if(rels.length >= user.analytics || count > user.analytics){
                    continue;
                  }
                    Relation.create({
                      camera_id: id,
                      algo_id: a.id,
                      atributes: stuff,
                      id_account: decoded.id_account,
                      id_branch: decoded.id_branch
                    })
                }
            }
            if(a.activated == false){
                for(var rela of rels){
                    if(rela.algo_id == a.id){
                      Relation.destroy({
                        where: {  id: rela.id  }
                    })
                    }
                }
            }
        }
            res.status(200).send({ success: true, message: 'Configuration set!'});
        }).catch(err => {
          res.status(500).send({success:false, message: err.message });
        });
      })
    })
    }

    exports.configsRoi = (req, res) =>{
      console.log(req.body)
      let token = req.headers["x-access-token"];
      const relas = req.body;
      const id = req.params.id
    
      jwt.verify(token, process.env.secret, (err, decoded) => {
        Relation.destroy({
          where: {  algo_id: relas.id , id_branch: decoded.id_branch, camera_id: id }
      }).then(respo=>{
        for(var inside of relas.rois){
          inside.pop()
          var atr = []
          atr.push(relas.conf)
          if(inside[inside.length - 1]['x'] == undefined){
            atr.push(inside[inside.length - 1])          
            inside.pop()
          }
          Relation.create({
            camera_id: id,
            algo_id: relas.id,
            roi_id: inside,
            atributes: atr,
            id_account: decoded.id_account,
            id_branch: decoded.id_branch
          })
        }
        res.status(200).send({ success: true, message: "Relations updated" });
      }).catch(err=>{
        res.status(500).send({ success:false, message: err.message });
      })
      })

    }

    exports.dashboards = (req,res) =>{
      let token = req.headers["x-access-token"];

      jwt.verify(token, process.env.secret, (err, decoded) => {

            User.findOne({
                where: { id: decoded.id_account }
              }).then(user=>{
                var authorities = [];
                user.getAlgorithms().then(roles => {
                  for (let i = 0; i < roles.length; i++) {
                    authorities.push(roles[i].name);
                  }
                  Algorithm.findAll().then(algos => {
                    var algors = []
                    for(var a of authorities){
                      for(var b of algos){
                      if(a == b['name']){
                        algors.push({id: b.id, name: b.name, available: 1})
                      }
                    }
                    }
                    let wh;
                    if(user.id_branch != 0000){
                      wh = {id_branch: decoded.id_branch }
                    }else{
                      wh = {id_account: decoded.id_account }
                    }
                    Relation.findAll({
                      where: wh
                    }).then(rels => {
                      rels = [...new Set(rels.map(item => item.algo_id))];
                      var analytics = []
                      for(var c of algors){
                        for(var d of rels){
                        if(c['id'] == parseInt(d)){
                          if(c['name'] == 'Heatmap'){
                            continue;
                          }
                          analytics.push({algo_id: parseInt(d), name: c['name'], status : "'primary'"})
                        }
                      }
                      }
                      Cameras.findAll({
                        where: wh,
                        attributes: ['name', 'id']
                      }).then(cameras => {
                          let set = {
                            analytics: analytics,
                            cameras: cameras
                          }
                          res.status(200).send({ success: true, data: set });
                      }).catch(err => {
                        res.status(500).send({ success: false, message: err.message });
                      });
                    }).catch(err => {
                      return res.status(500).send({ success:false, message: err.message });
                    });
                }).catch(err =>{
                  return res.status(500).send({ success: false, message: err.message });
                })
                });
              }).catch(err=>{
                return  res.status(500).send({ success: false, message: err.message });
              })
        });
    }