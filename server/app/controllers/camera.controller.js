const db = require("../models");
require('dotenv').config({ path: '../../config.env'});
const Camera = db.camera;
const Relations = db.relation
var jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require('uuid')
const cp = require('child_process');
const fs = require('fs');
Stream = require('node-rtsp-stream')
const path = process.env.home + process.env.username + process.env.pathDocker + process.env.resources


exports.addCamera = (req,res) => {
    let token = req.headers["x-access-token"];

    jwt.verify(token, process.env.secret, (err, decoded) => {
      let uuid =uuidv4()
  // Save User to Database
  Camera.create({
    id: uuid,
    name: req.body.name,
    rtsp_in: req.body.rtsp_in,
    id_account: decoded.id_account,
    id_branch: decoded.id_branch
  })
    .then(camera => {
          res.status(200).send({success: true, message: "Camera was registered successfully!", id: uuid});
    })
    .catch(err => {
      res.status(500).send({success: false, message: err.message });
    });
  })
  };

  exports.viewCams = (req, res) =>{
    let token = req.headers["x-access-token"];

    jwt.verify(token, process.env.secret, async (err, decoded) => {
        Camera.findAll({
            where: { id_branch: decoded.id_branch  },
            attributes: ['name', 'id','createdAt', 'updatedAt']
          }).then(cameras => {
              res.status(200).send({ success: true, data: cameras });
          }).catch(err => {
            res.status(500).send({ success: false, message: err.message });
          });
          })
  }

  exports.viewCam = (req, res) =>{
    let token = req.headers["x-access-token"];

    jwt.verify(token, process.env.secret, async (err, decoded) => {
        Camera.findOne({
            where: { id :  req.params.id, id_branch: decoded.id_branch},
          }).then(camera => {
              res.status(200).send({ success: true, data: camera });
          }).catch(err => {
            res.status(500).send({  success: false, message: err.message });
          });
          })
  }

  exports.delCam = (req, res) =>{
    let token = req.headers["x-access-token"];

    jwt.verify(token, process.env.secret, async (err, decoded) => {
      Relations.destroy({
        where: {  camera_id: req.params.id  }
    })
    const img = `${path}${decoded.id_account}/${decoded.id_branch}/heatmap_pics/${req.params.id}_heatmap.png`
    fs.unlink(img, (err) => {
        if(err) console.log({ success: false ,message: "Image error: " + err});
    })
    Camera.destroy({
        where: {  id: req.params.id, id_branch: decoded.id_branch  }
      }).then(cam => {
          res.status(200).send({ success: true, camera: req.params.uuid });
      }).catch(err => {
        res.status(500).send({ success: false, message: err.message });
      });
    })
  }

  exports.editCam = (req,res) => {
    var updt = req.body
    let token = req.headers["x-access-token"];

    jwt.verify(token, process.env.secret, async (err, decoded) => {
    Camera.update(updt,{
      where: {   id: req.params.id, id_branch: decoded.id_branch  }
    }).then(cam => {
        res.status(200).send({ success: true, data: updt });
    }).catch(err => {
      res.status(500).send({ success: false, message: err.message });
    });
    })
  };

  exports.addAtr = (req, res) =>{
    const camID = req.body.cam_id;

    let token = req.headers["x-access-token"];

    jwt.verify(token, process.env.secret, async (err, decoded) => {
    cp.exec(`python ./scripts/heatmap.py --cameraid ${camID}  --id_account ${decoded.id_account} --id_branch ${decoded.id_branch}` , function(err,data){
        if(err) res.status(500).send({ success: false, message: err });
        if(data) res.status(200).send({ success: true, data: data });
    })
  })
  }

  exports.cam = (req,res)=>{
    const data = req.body;
    let token = req.headers["x-access-token"];

    jwt.verify(token, process.env.secret, async (err, decoded) => {
        Camera.findOne({
            where: { id :  data.id, id_branch: decoded.id_branch},
          }).then(camera => {
            let port = 9999
            try{
              if(streams.length != 0){
                for(var a of streams){
                  if(a.port == port){
                    port = port - 1;
                  }
                }
              }
              
              stream = new Stream({
                name: camera.name,
                streamUrl: camera.rtsp_in,
                wsPort: port,
                fps: 15,
                ffmpegOptions: { // options ffmpeg flags
                  '-stats': '', // an option with no neccessary value uses a blank string
                  '-r': 30 ,// options with required values specify the value after the key
                  '-s' : '640x480'
                }
              })
              streams.push({str:stream, id:data.id, port: port})
              res.status(200).send({ success: true, port: port});
            }
            catch(err){
              res.status(500).send({  success: false, message: err.message });
            }
           
              
          }).catch(err => {
            res.status(500).send({  success: false, message: err.message });
          });
          })

  }

  exports.stopCam = (req,res) =>{
    const data = req.body;
    for(let i =0; i < streams.length; i++){
      if(streams[i]['id'] == data.id){
        streams[i].str.stop()
        streams.splice(i,1)
        continue;
      }
    }
    res.status(200).send({ success: true, message: 'Stopped'});
  }

  var streams = []

  exports.checkCamRel = (req,res) =>{
    const data = req.body;
    if(data.algo_id == -1){
      return res.status(200).send({ success: true, message: 'Skipping'});
    }
    if(data.algo_id == -2){
      return res.status(200).send({ success: true, message: 'Skipping'});
    }
    Relations.findAll({
      where:{ camera_id :  data.id , algo_id: data.algo_id}
    }).then(ress=>{
      let mess;
      if(ress.length == 0){
        mess = false;
      }else{
        mess = true
      }
      res.status(200).send({ success: true, fact: mess});
    }).catch(err =>{
      res.status(500).send({  success: false, message: err.message });
    })
  }
