const db = require('../models')
require('dotenv').config({path: '../../config.env'})
var jwt = require('jsonwebtoken')
const Cameras = db.camera
const Relation = db.relation
const Algorithm = db.algorithm
const User = db.user

const tables = {
  'Facial Recognition': {
    id: 0,
    table: 'faces',
    alert: true
  },
  'Person Climbing Barricade': {
    id: 1,
    table: 'climbing',
    alert: true
  },
  'Loitering Detection': {
    id: 2,
    table: 'loitering',
    alert: true
  },
  'D&C of human, animal and vehicle': {
    id: 3,
    table: '',
    alert: true
  },
  'Parking Violation': {
    id: 4,
    table: 'parking',
    alert: true
  },
  'Speeding Vehicle': {
    id: 5,
    table: 'speed',
    alert: true
  },
  'Helmet detection on two-wheeler': {
    id: 6,
    table: '',
    alert: true
  },
  'Banned vehicle detection': {
    id: 7,
    table: '',
    alert: true
  },
  'Wrong way or illegal turn detection': {
    id: 8,
    table: 'direction',
    alert: true
  },
  'Graffiti & Vandalism detection': {
    id: 9,
    table: 'graffiti',
    alert: true
  },
  'Debris & Garbage detection': {
    id: 10,
    table: '',
    alert: true
  },
  'Garbage bin, cleanned or not': {
    id: 11,
    table: '',
    alert: true
  },
  'People Count': {
    id: 12,
    table: 'pc',
    alert: false
  },
  ANPR: {
    id: 13,
    table: 'plate',
    alert: true
  },
  Heatmap: {
    id: 14,
    table: 'heatmap',
    alert: false
  },
  Demographics: {
    id: 15,
    table: 'faces',
    alert: true
  },
  'Abandoned Object': {
    id: 16,
    table: 'aod',
    alert: true
  },
  'Intrusion Alert': {
    id: 17,
    table: 'intrude',
    alert: true
  },
  'Attendance Management': {
    id: 18,
    table: '',
    alert: true
  },
  Violence: {
    id: 19,
    table: 'violence',
    alert: true
  },
  'No Mask': {
    id: 20,
    table: 'mask',
    alert: true
  },
  'Social Distancing': {
    id: 21,
    table: 'sociald',
    alert: true
  },
  'Queue Management': {
    id: 22,
    table: 'queue_mgt',
    alert: false
  },
  'Helmet Detection': {
    id: 23,
    table: 'helm',
    alert: true
  },
  'Vault Open': {
    id: 24,
    table: 'vault',
    alert: true
  },
  'Barrier Not Closed': {
    id: 25,
    table: 'barrier',
    alert: true
  },
  'Vehicle Counting': {
    id: 26,
    table: 'vcount',
    alert: false
  },
  'Camera Tampering': {
    id: 27,
    table: 'tamper',
    alert: true
  },
  'Animal Detection': {
    id: 29,
    table: 'animal',
    alert: true
  },
  'Accident Detection': {
    id: 28,
    table: 'accident',
    alert: true
  },
  'Axle Count': {
    id: 30,
    table: 'axle',
    alert: true
  },
  'Car make Classification': {
    id: 31,
    table: 'carmake',
    alert: true
  },
  Clothing: {
    id: 32,
    table: 'clothing',
    alert: true
  },
  'Vehicle Count at Screen': {
    id: 33,
    table: 'vcount_screen',
    alert: false
  },
  'Car Brand': {
    id: 34,
    table: 'carbrand',
    alert: true
  },
  'People Path': {
    id: 37,
    table: 'heatmap',
    alert: true
  },
  Weapon: {
    id: 35,
    table: 'weapon',
    alert: true
  },
  Bottle: {
    id: 36,
    table: 'bottle',
    alert: true
  },
  'Person Collapsing': {
    id: 38,
    table: 'Collapse',
    alert: true
  },
  'Fire Detection': {
    id: 38,
    table: 'fire',
    alert: true
  },
  'Pulling Hair': {
    id: 40,
    table: 'pulling',
    alert: true
  },
  'Waving Hands': {
    id: 41,
    table: 'waving',
    alert: true
  },
  Smoking: {
    id: 42,
    table: 'smoking',
    alert: true
  },
  Crowd: {
    id: 43,
    table: 'crowd',
    alert: true
  },
  Slapping: {
    id: 44,
    table: 'slapping',
    alert: true
  },
  Blocking: {
    id: 45,
    table: 'blocking',
    alert: true
  },
  Running: {
    id: 46,
    table: 'running',
    alert: true
  },
  Disrobing: {
    id: 47,
    table: 'disrobing',
    alert: true
  },
  'Purse Snatching': {
    id: 48,
    table: 'purse_snatching',
    alert: true
  },
  Following: {
    id: 49,
    table: 'following',
    alert: true
  },
  Pushing: {
    id: 50,
    table: 'pushing',
    alert: true
  }
}

exports.getRels = async (req, res) => {
  let data = []
  Relation.findAll({
    where: {camera_id: req.params.id}
  })
    .then(async rels => {
      for (const rel of rels) {
        await Algorithm.findOne({
          where: {id: rel.dataValues.algo_id}
        }).then(alg => {
          rel.dataValues['algo_name'] = alg.dataValues.name
          rel.dataValues['table'] = tables[alg.dataValues.name].table
          rel.dataValues['alert'] = tables[alg.dataValues.name].alert
          data.push(rel)
        })
      }
      res.status(200).send({success: true, data: data})
    })
    .catch(err => {
      res.status(500).send({success: false, message: err.message})
    })
}

exports.getAll = (req, res) => {
  let token = req.headers['x-access-token']

  jwt.verify(token, process.env.secret, (err, decoded) => {
    Relation.findAll({
      where: {id_branch: decoded.id_branch}
    })
      .then(rels => {
        res.status(200).send({success: true, data: rels})
      })
      .catch(err => {
        res.status(500).send({success: false, message: err.message})
      })
  })
}

exports.createRel = (req, res) => {
  let token = req.headers['x-access-token']
  const rel = req.body

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
        res.status(200).send({success: true, message: 'Relation was registered successfully!'})
      })
      .catch(err => {
        res.status(500).send({success: false, message: err.message})
      })
  })
}

exports.deleteRel = (req, res) => {
  Relation.destroy({
    where: {id: req.params.id}
  })
    .then(rel => {
      res.status(200).send({success: true, rel: req.params.id})
    })
    .catch(err => {
      res.status(500).send({success: false, message: err.message})
    })
}

exports.editRel = (req, res) => {
  var updt = req.body
  console.log(updt)
  Relation.update(updt, {
    where: {id: req.params.id}
  })
    .then(user => {
      res.status(200).send({success: true, data: updt})
    })
    .catch(err => {
      res.status(500).send({success: false, message: err.message})
    })
}

exports.configs = (req, res) => {
  let token = req.headers['x-access-token']
  let inf = req.body
  const id = req.params.id
  var count = 0
  jwt.verify(token, process.env.secret, (err, decoded) => {
    User.findOne({
      where: {
        id: decoded.id_account
      }
    }).then(user => {
      Relation.findAll({
        where: {camera_id: id}
      })
        .then(rels => {
          for (var a of inf[0]) {
            var stuff = []
            var confStuff = {}
            var upAdd = 1
            if (a.activated == true && a.id != 4) {
              // && a.id != 8
              count++
              confStuff['conf'] = a.conf
              confStuff['save'] = a.save
              confStuff['time'] = a.time
              stuff.push(confStuff)
              if (a.id == 1) {
                stuff.push(inf[1])
              }
              if (a.id == 2) {
                stuff.push(inf[2])
              }
              if (a.id == 16) {
                stuff.push(inf[3])
              }
              if (a.id == 5) {
                stuff.push(inf[4])
              }
              if (a.id == 7) {
                stuff.push(inf[5])
              }
              if (a.id == 3) {
                stuff.push(inf[6])
              }
              if (a.id == 12) {
                stuff.push(inf[7])
              }
              for (var rela of rels) {
                if (rela.algo_id == a.id) {
                  if (rela.atributes != JSON.stringify(stuff)) {
                    upAdd = 2
                    if (stuff.hasOwnProperty('atributes')) {
                      stuff.atributes = stuff.atributes
                    }
                    let atr = {
                      atributes: stuff
                    }
                    Relation.update(atr, {
                      where: {id: rela.id}
                    })
                  } else {
                    upAdd = 0
                  }
                }
              }
              if (upAdd == 1) {
                if (rels.length >= user.analytics || count > user.analytics) {
                  continue
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
            if (a.activated == false) {
              for (var rela of rels) {
                if (rela.algo_id == a.id) {
                  Relation.destroy({
                    where: {id: rela.id}
                  })
                }
              }
            }
          }
          res.status(200).send({success: true, message: 'Configuration set!'})
        })
        .catch(err => {
          res.status(500).send({success: false, message: err.message})
        })
    })
  })
}

exports.configsRoi = (req, res) => {
  let token = req.headers['x-access-token']
  const relas = req.body
  const id = req.params.id

  jwt.verify(token, process.env.secret, (err, decoded) => {
    Relation.destroy({
      where: {algo_id: relas.id, id_branch: decoded.id_branch, camera_id: id}
    })
      .then(respo => {
        for (var inside of relas.rois) {
          inside.pop()
          var atr = []
          atr.push(relas.conf)
          if (inside[inside.length - 1]['x'] == undefined) {
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
        res.status(200).send({success: true, message: 'Relations updated'})
      })
      .catch(err => {
        res.status(500).send({success: false, message: err.message})
      })
  })
}

exports.dashboards = (req, res) => {
  let token = req.headers['x-access-token']

  jwt.verify(token, process.env.secret, (err, decoded) => {
    User.findOne({
      where: {id: decoded.id_account}
    })
      .then(user => {
        var authorities = []
        user.getAlgorithms().then(roles => {
          for (let i = 0; i < roles.length; i++) {
            authorities.push(roles[i].name)
          }

          Algorithm.findAll()
            .then(algos => {
              var algors = []
              for (var a of authorities) {
                for (var b of algos) {
                  if (a == b['name']) {
                    algors.push({id: b.id, name: b.name, available: 1})
                  }
                }
              }
              let wh
              if (user.id_branch != 0000) {
                wh = {id_branch: decoded.id_branch}
              } else {
                wh = {id_account: decoded.id_account}
              }
              Relation.findAll({
                where: wh
              })
                .then(rels => {
                  rels = [...new Set(rels.map(item => item.algo_id))]
                  var analyticsPrem = []
                  var analyticsThreats = []
                  for (var c of algors) {
                    for (var d of rels) {
                      if (c['id'] == parseInt(d)) {
                        // if (c['name'] == 'Heatmap') {
                        //   continue
                        // }
                        if (
                          parseInt(d) == 12 ||
                          parseInt(d) == 22 ||
                          parseInt(d) == 2 ||
                          parseInt(d) == 24 ||
                          parseInt(d) == 14 ||
                          parseInt(d) == 35
                        ) {
                          analyticsPrem.push({
                            algo_id: parseInt(d),
                            name: c['name'],
                            status: "'primary'"
                          })
                        } else {
                          analyticsThreats.push({
                            algo_id: parseInt(d),
                            name: c['name'],
                            status: "'primary'"
                          })
                        }
                        // analytics.push({algo_id: parseInt(d), name: c['name'], status : "'primary'"})
                      }
                    }
                  }
                  Cameras.findAll({
                    where: wh,
                    attributes: ['name', 'id']
                  })
                    .then(cameras => {
                      let set = {
                        analyticsP: analyticsPrem,
                        analyticsT: analyticsThreats,
                        cameras: cameras
                      }
                      res.status(200).send({success: true, data: set})
                    })
                    .catch(err => {
                      res.status(500).send({success: false, message: err.message})
                    })
                })
                .catch(err => {
                  return res.status(500).send({success: false, message: err.message})
                })
            })
            .catch(err => {
              return res.status(500).send({success: false, message: err.message})
            })
        })
      })
      .catch(err => {
        return res.status(500).send({success: false, message: err.message})
      })
  })
}

exports.checkVideo = (req, res) => {
  const id = req.params.id
  const cam_id = req.params.cam

  Relation.findOne({
    where: {algo_id: id, camera_id: cam_id}
  })
    .then(rel => {
      let status = false
      if (rel.http_out === undefined || rel.http_out === null || rel.http_out === '') {
        return res.status(200).send({success: true, video: status, http_out: ''})
      } else {
        let http_out = rel.http_out
        if (rel.atributes[0]['time'] > 0) status = !status
        res.status(200).send({success: true, video: status, http_out: http_out})
      }
    })
    .catch(err => {
      res.status(500).send({success: false, message: err.message})
    })
}
