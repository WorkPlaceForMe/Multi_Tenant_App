require('dotenv').config({
    path: '../../config.env'
});
const db1 = require('../models');
const jwt = require('jsonwebtoken');
const db = require('../models/dbmysql');
const Relation = db1.relation;

let tbs = {
    'loitering': 'loitering',
    'intrusion': 'intrude',
    'people count': 'pcount',
    'demographics': 'faces',
    'parking': 'parking',
    'speeding': 'speed',
    'vehicle count': 'vcount',
    'anpr': 'plate',
    'aod': 'aod',
    'queue mgmt': 'queue_mgt',
    'animals': 'animal',
    'accident': 'accident',
    'axle': 'axle',
    'carmake': 'carmake',
};

let dom = {
    'loitering': 'People related',
    'intrusion': 'People related',
    'people count': 'People related',
    'demographics': 'People related',
    'aod': 'People related',
    'parking': 'Traffic Management related',
    'speeding': 'Traffic Management related',
    'vehicle count': 'Traffic Management related',
    'anpr': 'Traffic Management related',
    'queue mgmt': 'People related',
    'animals': 'Traffic Management related',
    'accident': 'Traffic Management related',
    'axle': 'Traffic Management related',
    'carmake': 'Traffic Management related',
    /* facial_recognition: 'People related',
    person_climbing_barricade: 'People related',
    heatmap: 'People related',
    violence: 'People related',
    no_mask: 'People related',
    social_distancing: 'People related',
    vault: 'People related',
    helmet: 'Traffic Management related',
    wrong_way_or_illegal_turn_detection: 'Traffic Management related',
    barrier_not_closed: 'Traffic Management related',
    camera_tempering: 'Traffic Management related',
    garbage_bin_cleanned_or_not: 'Security realated' */
}

let algo_id = {
    'loitering': 2,
    'intrusion': 17,
    'people count': 12,
    'demographics': 15,
    'parking': 32,
    'speeding': 5,
    'vehicle count': 26,
    'anpr': 13,
    'aod': 16,
    'queue mgmt': 22,
    'animals': 28,
    'accident': 29,
    'axle': 30,
    'carmake': 31
    /* facial_recognition: 0,
    person_climbing_barricade: 1,
    heatmap: 14,
    violence: 19,
    no_mask: 20,
    social_distancing: 21,
    vault: 24,
    helmet: 6,
    wrong_way_or_illegal_turn_detection: 8,
    barrier_not_closed: 25,
    camera_tempering: 27,
    garbage_bin_cleanned_or_not: 11 */
}

exports.getAlerts = (req, res) => {
    let token = req.headers['x-access-token']
    let body = req.body;
    let end = body.end;
    let type = body.type;
    let start = body.start;
    let id = req.params.id;
    let alertType = req.query.alert_type;
    let table = tbs[alertType];
    let td = [];

    try {
        jwt.verify(token, process.env.secret, async (err, decoded) => {
            if(err) return res.status(500).json(err.message);
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
            Relation.findOne({
                where: wh
              })
                .then(async rel => {
                    await db
                    .con()
                    .query(`SELECT * from ${table} WHERE ${type} = '${id}' and time >= '${start}' and  time <= '${end}' order by time asc;`,
                    function (err, result) {
                        if (err) {
                        return res.status(500).json({
                            success: false,
                            message: err
                        });
                        }
                        result.forEach(element => {
                            let picture;
                            let addProp = [];
                            let d = element.time;
                            let se = d.getSeconds();
                            let mi = d.getMinutes();
                            let ho = d.getHours();
                            if (se < 10) {
                            se = '0' + se;
                            }
                            if (mi < 10) {
                            mi = '0' + mi;
                            }
                            if (ho < 10) {
                            ho = '0' + ho;
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
                            se;
                            let resp = {
                                alert_type: alertType,
                                domain: dom[alertType],
                                cam_id: (element.camera_id == undefined) ? element.cam_id : element.camera_id,
                                cam_name: (element.camera_name == undefined) ? element.cam_name : element.camera_name,
                                id: element.id,
                                id_account: element.id_account,
                                id_branch: element.id_branch,
                                pic_path: '',
                                time: element.time,
                                track_id: ''
                            }

                            if(element.track_id == undefined || element.track_id == null) {
                                picture = `${d}.jpg`
                                resp.pic_path =  `${process.env.app_url}/api/pictures/${decoded.id_account}/${decoded.id_branch}/${table}/${id}/${picture}`
                            } else {
                                resp.track_id =  element.track_id;
                                picture = `${d}_${resp.track_id}.jpg`
                                resp.pic_path =  `${process.env.app_url}/api/pictures/${decoded.id_account}/${decoded.id_branch}/${table}/${id}/${picture}`
                            }

                            if (rel.atributes[0].time > 0) {
                                if(element.track_id == undefined || element.track_id == null) {
                                    resp.clip_path = `${d}.mp4`;
                                    resp.pic_path = `${process.env.app_url}/api/pictures/${decoded.id_account}/${decoded.id_branch}/demographic/${req.params.id}/${resp.clip_path}`;
                                } else {
                                    resp.track_id =  element.track_id;
                                    resp.clip_path = `${d}_${resp.track_id}.mp4`;
                                    resp.pic_path = `${process.env.app_url}/api/pictures/${decoded.id_account}/${decoded.id_branch}/loitering/${req.params.id}/${resp.clip_path}`;
                                }
                            }

                            let keys = Object.keys(element);
                            keys.forEach(itm => {
                                if(itm == 'id' || itm == 'cam_id' || itm == 'camera_id' || itm == 'cam_name' || itm == 'camera_name' || itm == 'id_account' || itm == 'id_branch' || itm == 'time' || itm == 'track_id') {}
                                else {
                                    let obj = {
                                        propertyName: itm,
                                        propertyValue: element[itm],
                                        propertyUnit: typeof(element[itm])
                                    }
                                    addProp.push(obj);
                                }
                            });
                            resp["additional_properties"] = addProp;
                            td.push(resp);
                        });
                        console.log('result : ', result);
                        res.json({
                            success: true,
                            total: result.length,
                            data: td
                        });
                    });
                });
        });
    } catch(err) {
        res.json({success: false, message: err.message});
    }
}