require('dotenv').config({
  path: '../../config.env'
})
const db1 = require('../models')
const jwt = require('jsonwebtoken')
const db = require('../models/dbmysql')
const Relation = db1.relation

let tbs = {
  'Loitering Detection': 'loitering WHERE',
  'Intrusion Alert': 'intrude WHERE',
  'People Count': 'pcount WHERE',
  Demographics: 'faces WHERE',
  'No Mask': `alerts WHERE alert= 'no mask' and`,
  'Social Distancing': `alerts WHERE alert= 'sociald' and`,
  'Helmet Detection': `alerts WHERE alert= 'helmet' and`,
  Clothing: 'clothing WHERE',
  'Parking Violation': 'parking WHERE',
  'Speeding Vehicle': 'speed WHERE',
  'Vehicle Counting': 'vcount WHERE',
  ANPR: 'plate WHERE',
  'Abandoned Object': 'aod WHERE',
  'Camera Tampering': `alerts WHERE alert= 'tamper' and`,
  'Queue Management': 'queue_mgt WHERE',
  'Animal Detection': 'animal WHERE',
  'Accident Detection': 'accident WHERE',
  'Axle Count': 'axle WHERE',
  'Wrong way or illegal turn detection': 'direction WHERE',
  'Car make Classification': 'carmake WHERE'
}

const imgFolders = {
  'Loitering Detection': 'loitering',
  'Intrusion Alert': 'intrude',
  'People Count': 'pcount',
  Demographics: 'faces',
  'No Mask': 'covered',
  Clothing: 'cloth',
  'Social Distancing': 'social',
  'Parking Violation': 'parking',
  'Speeding Vehicle': 'speed',
  'Helmet Detection': 'helm',
  'Vehicle Counting': 'vcount',
  ANPR: 'anpr',
  'Abandoned Object': 'aod',
  'Camera Tampering': 'tamper',
  'Queue Management': 'queue',
  'Animal Detection': 'animal',
  'Accident Detection': 'accident',
  'Wrong way or illegal turn detection': 'direction',
  'Axle Count': 'axle',
  'Car make Classification': 'carmake'
  // loitering: 'loitering',
  // intrusion: 'intrude',
  // 'people count': 'pcount',
  // demographics: 'faces',
  // 'no mask': 'covered',
  // 'social distancing': 'social',
  // helmet: 'helm',
  // clothing: 'cloth',
  // parking: 'parking',
  // speeding: 'speed',
  // 'vehicle count': 'vcount',
  // anpr: 'anpr',
  // aod: 'aod',
  // 'camera tampering': 'tamper',
  // 'queue mgmt': 'queue',
  // animals: 'animal',
  // accident: 'accident',
  // axle: 'axle',
  // 'wrong direction': 'direction',
  // carmake: 'carmake'
}

// let dom = {
//   loitering: 'People related',
//   intrusion: 'People related',
//   'people count': 'People related',
//   demographics: 'People related',
//   'social distancing': 'People related',
//   'no mask': 'People related',
//   helmet: 'People related',
//   clothing: 'People related',
//   aod: 'People related',
//   'queue mgmt': 'People related',
//   parking: 'Traffic Management related',
//   speeding: 'Traffic Management related',
//   'vehicle count': 'Traffic Management related',
//   anpr: 'Traffic Management related',
//   animals: 'Traffic Management related',
//   accident: 'Traffic Management related',
//   axle: 'Traffic Management related',
//   'camera tampering': 'Traffic Management related',
//   'wrong direction': 'Traffic Management related',
//   carmake: 'Traffic Management related'
// }
let dom = {
  'Loitering Detection': 'People related',
  'Intrusion Alert': 'People related',
  'People Count': 'People related',
  Demographics: 'People related',
  'No Mask': 'People related',
  Clothing: 'People related',
  'Social Distancing': 'People related',
  'Parking Violation': 'Traffic Management related',
  'Speeding Vehicle': 'Traffic Management related',
  'Helmet Detection': 'Traffic Management related',
  'Vehicle Counting': 'Traffic Management related',
  ANPR: 'Traffic Management related',
  'Abandoned Object': 'People related',
  'Camera Tampering': 'Traffic Management related',
  'Queue Management': 'People related',
  'Animal Detection': 'Traffic Management related',
  'Accident Detection': 'Traffic Management related',
  'Wrong way or illegal turn detection': 'Traffic Management related',
  'Axle Count': 'Traffic Management related',
  'Car make Classification': 'Traffic Management related'
}

let algo_id = {
  // loitering: 2,
  // intrusion: 17,
  // 'people count': 12,
  // demographics: 15,
  // 'no mask': 20,
  // 'social distancing': 21,
  // helmet: 23,
  // clothing: 32,
  // parking: 32,
  // speeding: 5,
  // 'vehicle count': 26,
  // anpr: 13,
  // aod: 16,
  // 'wrong direction': 8,
  // 'queue mgmt': 22,
  // 'camera tampering': 27,
  // animals: 28,
  // accident: 29,
  // axle: 30,
  // carmake: 31,
  'Loitering Detection': 2,
  'Intrusion Alert': 17,
  'People Count': 12,
  Demographics: 15,
  'No Mask': 20,
  Clothing: 32,
  'Social Distancing': 21,
  'Parking Violation': 32,
  'Speeding Vehicle': 5,
  'Helmet Detection': 23,
  'Vehicle Counting': 26,
  ANPR: 13,
  'Abandoned Object': 16,
  'Camera Tampering': 27,
  'Queue Management': 22,
  'Animal Detection': 28,
  'Accident Detection': 29,
  'Wrong way or illegal turn detection': 8,
  'Axle Count': 30,
  'Car make Classification': 31
}

exports.getAlerts = (req, res) => {
  let token = req.headers['x-access-token']
  let body = req.body
  let end = body.end
  let type = body.type
  let start = body.start
  let id = req.params.id
  let alertType = req.query.alert_type
  let table = tbs[alertType]
  let td = []
  console.log(table)

  try {
    jwt.verify(token, process.env.secret, async (err, decoded) => {
      if (err) return res.status(500).json(err.message)
      let wh
      if (decoded.id_branch != 0000) {
        wh = {
          id_branch: decoded.id_branch,
          algo_id: algo_id[alertType]
        }
      } else {
        wh = {
          id_account: decoded.id_account,
          algo_id: algo_id[alertType]
        }
      }
      console.log(
        `SELECT * from ${table} ${type} = '${id}' and time >= '${start}' and  time <= '${end}' order by time asc;`
      )
      Relation.findOne({
        where: wh
      }).then(async rel => {
        await db
          .con()
          .query(
            `SELECT * from ${table} ${type} = '${id}' and alert = '1' and time >= '${start}' and  time <= '${end}' order by time asc;`,
            function (err, result) {
              if (err) {
                return res.status(500).json({
                  success: false,
                  message: err
                })
              }
              console.log('Total result fetched : ', result.length)
              result.forEach(element => {
                let picture
                let addProp = []
                let d = element.time
                let se = d.getSeconds()
                let mi = d.getMinutes()
                let ho = d.getHours()
                if (se < 10) {
                  se = '0' + se
                }
                if (mi < 10) {
                  mi = '0' + mi
                }
                if (ho < 10) {
                  ho = '0' + ho
                }
                d =
                  d.getFullYear() +
                  '-' +
                  (d.getMonth() + 1) +
                  '-' +
                  d.getDate() +
                  '_' +
                  ho +
                  ':' +
                  mi +
                  ':' +
                  se
                let resp = {
                  alert_type: alertType,
                  domain: dom[alertType],
                  cam_id: element.camera_id == undefined ? element.cam_id : element.camera_id,
                  cam_name:
                    element.camera_name == undefined ? element.cam_name : element.camera_name,
                  id: element.id,
                  id_account: element.id_account,
                  id_branch: element.id_branch,
                  pic_path: '',
                  time: element.time,
                  track_id: ''
                }

                if (element.track_id == undefined || element.track_id == null) {
                  delete resp.track_id
                } else {
                  resp.track_id = element.track_id
                  picture = `${d}_${resp.track_id}.jpg`
                  resp.pic_path = `${process.env.app_url}/api/pictures/${decoded.id_account}/${decoded.id_branch}/${imgFolders[alertType]}/${id}/${picture}`
                }
                if (rel != null) {
                  if (rel.atributes[0].time > 0) {
                    if (element.track_id == undefined || element.track_id == null) {
                      delete resp.track_id
                    } else {
                      resp.track_id = element.track_id
                      resp.clip_path = `${d}_${resp.track_id}.mp4`
                      resp.pic_path = `${process.env.app_url}/api/pictures/${decoded.id_account}/${decoded.id_branch}/loitering/${req.params.id}/${resp.clip_path}`
                    }
                  }
                }

                let keys = Object.keys(element)
                keys.forEach(itm => {
                  if (
                    itm == 'id' ||
                    itm == 'cam_id' ||
                    itm == 'camera_id' ||
                    itm == 'cam_name' ||
                    itm == 'camera_name' ||
                    itm == 'id_account' ||
                    itm == 'id_branch' ||
                    itm == 'time' ||
                    itm == 'track_id'
                  ) {
                  } else {
                    let obj = {
                      propertyName: itm,
                      propertyValue: element[itm],
                      propertyUnit: typeof element[itm]
                    }
                    addProp.push(obj)
                  }
                })
                resp['additional_properties'] = addProp
                td.push(resp)
              })
              res.json({
                success: true,
                total: result.length,
                data: td
              })
            }
          )
      })
    })
  } catch (err) {
    res.json({success: false, message: err.message})
  }
}
