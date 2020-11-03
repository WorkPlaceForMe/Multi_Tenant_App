require('dotenv').config({ path: '../../config.env'});
const db1 = require("../models");
var jwt = require("jsonwebtoken");
var db=require('../models/dbmysql');
const Relation = db1.relation

exports.loitering = (req, res) =>{
  
    let token = req.headers["x-access-token"];
    const data = req.body;
    jwt.verify(token, process.env.secret, (err, decoded) => {
        Relation.findOne({
            where: { id_branch: decoded.id_branch, algo_id : 2 }
          }).then(rel => {
       db.con().query(`SELECT * from loitering WHERE cam_id = '${req.params.id}' and time >= '${data.start}' and  time <= '${data.end}' order by time asc;`, function (err, result) {
        if (err) return res.status(500).json({success: false, message: err});
        let avg = 0;
        let min = 0;
        let max = 0;
        var ress = {};
        var dwell = []
        var labelsD = []
          result.forEach(function(v) {
            ress[v.time.getHours()] = (ress[v.time.getHours()] || 0) + 1;
            dwell.push(v.dwell)
            labelsD.push(v.time)
            avg = avg + v.dwell;
            if(min == 0){
              min = v.dwell
            }else if(v.dwell < min){
              min = v.dwell
            }
            if(max == 0){
              max = v.dwell
            }else if(v.dwell > max){
              max = v.dwell
            }
            let d = v.time
            let se = d.getSeconds()
            let mi = d.getMinutes()
            let ho = d.getHours()
            if(se < 10){
              se = '0' + se;
            }
            if(mi < 10){
              mi = '0' + mi;
            }
            if(ho < 10){
              ho = '0' + ho;
            }
            d = d.getFullYear()  + "-" + (d.getMonth()+1) + "-" + d.getDate() + "_" + ho + ":" + mi + ":" + se;
            v['picture'] = `${d}_${v.track_id}.jpg`;
            let l = (v.dwell/rel.atributes[1].time) - 1
            if(l >= 2){
                l = 2
            }
            let r;
            switch(l){
                case 0:{
                  r = 'Low';
                  break;
                }
                case 1:{
                  r = 'Med';
                  break;
                }
                case 2:{
                  r = 'High';
                  break;
                }
              }
            v['severity'] = l;
            v['alert'] = r;
          })
          avg = Math.round((avg/ result.length) * 100) / 100;
        let av = result.length/24
        let a = {
            total: result.length,
            avgH: Math.round(av * 100) / 100,
            avgS: Math.round((av/(60*60))* 100) /100,
            raw: result,
            dwell: dwell,
            labelsD: labelsD,
            histogram: ress,
            min: min,
            max: max,
            avg: avg
        }
        res.status(200).json({success: true, data: a})
      });
    }).catch(
        err=>{
            return res.status(500).send({ success: false, message: err });
        }
    )
  })
}

exports.intrude = (req, res) =>{
  
  let token = req.headers["x-access-token"];
  const data = req.body;
  jwt.verify(token, process.env.secret, (err, decoded) => {
     db.con().query(`SELECT * from intrude WHERE cam_id = '${req.params.id}' and time >= '${data.start}' and  time <= '${data.end}' order by time asc;`, function (err, result) {
      if (err) return res.status(500).json({success: false, message: err});
      let ress = {}
      let avg = 0;
      let cache = '';
      let ressover = {};
      result.forEach(function(v) {
        if(cache == ''){
          cache = v.time.getFullYear()  + "-" + (v.time.getMonth()+1) + "-" + v.time.getDate() + ' ' + v.time.getHours()
        }
        
        if(cache != v.time.getFullYear()  + "-" + (v.time.getMonth()+1) + "-" + v.time.getDate() + ' ' + v.time.getHours() ){
          
          while(cache != v.time.getFullYear()  + "-" + (v.time.getMonth()+1) + "-" + v.time.getDate() + ' ' + v.time.getHours() ){
            cache = new Date(cache + ':00:00')
            ressover[cache.getFullYear()  + "-" + (cache.getMonth()+1) + "-" + cache.getDate() + ' ' +(cache.getHours() + 1)] = 0;
            cache = cache.getFullYear()  + "-" + (cache.getMonth()+1) + "-" + cache.getDate() + ' ' +(cache.getHours() + 1);
          }
        }
        if(cache == v.time.getFullYear()  + "-" + (v.time.getMonth()+1) + "-" + v.time.getDate() + ' ' + v.time.getHours() ){
          ressover[v.time.getFullYear()  + "-" + (v.time.getMonth()+1) + "-" + v.time.getDate() + ' ' + v.time.getHours()] = (ressover[v.time.getFullYear()  + "-" + (v.time.getMonth()+1) + "-" + v.time.getDate() + ' ' + v.time.getHours()] || 0) + 1;
        }
        ress[v.zone] = (ress[v.zone] || 0) + 1;
        avg = avg + v.dwell;
        let d = v.time
        let se = d.getSeconds()
        let mi = d.getMinutes()
        let ho = d.getHours()
        if(se < 10){
          se = '0' + se;
        }
        if(mi < 10){
          mi = '0' + mi;
        }
        if(ho < 10){
          ho = '0' + ho;
        }
        d = d.getFullYear()  + "-" + (d.getMonth()+1) + "-" + d.getDate() + "_" + ho + ":" + mi + ":" + se;
        v['picture'] = `${d}_${v.track_id}_zone${v.zone}.jpg`;
      })
      let lo = []
      for(var l of Object.keys(ress)){
        lo.push({name: l, value: ress[l], perc: JSON.stringify(Math.round((ress[l]/result.length) * 100)) + '%'})
      }
      avg = Math.round((avg/ result.length) * 100) / 100;
      let av = result.length/24
      let a = {
          total: result.length,
          avgH: Math.round(av * 100) / 100,
          raw: result,
          donut: lo,
          over: ressover
      }
      res.status(200).json({success: true, data: a})
    });
  })
}

exports.violence = (req, res) =>{
  
  let token = req.headers["x-access-token"];
  const data = req.body;
  jwt.verify(token, process.env.secret, (err, decoded) => {
     db.con().query(`SELECT * from violence WHERE cam_id = '${req.params.id}' and time >= '${data.start}' and  time <= '${data.end}' order by time asc;`, function (err, result) {
      if (err) return res.status(500).json({success: false, message: err});
      let ress = {};
      let cache = '';
      for(var v of result){
        if(cache == ''){
          cache = v.time.getFullYear()  + "-" + (v.time.getMonth()+1) + "-" + v.time.getDate() + ' ' + v.time.getHours()
        }
        
        if(cache != v.time.getFullYear()  + "-" + (v.time.getMonth()+1) + "-" + v.time.getDate() + ' ' + v.time.getHours() ){
          
          while(cache != v.time.getFullYear()  + "-" + (v.time.getMonth()+1) + "-" + v.time.getDate() + ' ' + v.time.getHours() ){
            cache = new Date(cache + ':00:00')
            ress[cache.getFullYear()  + "-" + (cache.getMonth()+1) + "-" + cache.getDate() + ' ' +(cache.getHours() + 1)] = 0;
            cache = cache.getFullYear()  + "-" + (cache.getMonth()+1) + "-" + cache.getDate() + ' ' +(cache.getHours() + 1);
          }
        }
        if(cache == v.time.getFullYear()  + "-" + (v.time.getMonth()+1) + "-" + v.time.getDate() + ' ' + v.time.getHours() ){
          ress[v.time.getFullYear()  + "-" + (v.time.getMonth()+1) + "-" + v.time.getDate() + ' ' + v.time.getHours()] = (ress[v.time.getFullYear()  + "-" + (v.time.getMonth()+1) + "-" + v.time.getDate() + ' ' + v.time.getHours()] || 0) + 1;
        }
      }
      let a = {
          total: result.length,
          raw: result,
          over: ress
      }
      res.status(200).json({success: true, data: a})
    });
  })
}

exports.aod = (req, res) =>{
  
  let token = req.headers["x-access-token"];
  const data = req.body;
  jwt.verify(token, process.env.secret, (err, decoded) => {
     db.con().query(`SELECT * from aod WHERE cam_id = '${req.params.id}' and time >= '${data.start}' and  time <= '${data.end}' order by time asc;`, function (err, result) {
      if (err) return res.status(500).json({success: false, message: err});
      let ress = {}
      let cache = '';
      for(var v of result){
        if(cache == ''){
          cache = v.time.getFullYear()  + "-" + (v.time.getMonth()+1) + "-" + v.time.getDate() + ' ' + v.time.getHours()
        }
        
        if(cache != v.time.getFullYear()  + "-" + (v.time.getMonth()+1) + "-" + v.time.getDate() + ' ' + v.time.getHours() ){
          
          while(cache != v.time.getFullYear()  + "-" + (v.time.getMonth()+1) + "-" + v.time.getDate() + ' ' + v.time.getHours() ){
            cache = new Date(cache + ':00:00')
            ress[cache.getFullYear()  + "-" + (cache.getMonth()+1) + "-" + cache.getDate() + ' ' +(cache.getHours() + 1)] = 0;
            cache = cache.getFullYear()  + "-" + (cache.getMonth()+1) + "-" + cache.getDate() + ' ' +(cache.getHours() + 1);
          }
        }
        if(cache == v.time.getFullYear()  + "-" + (v.time.getMonth()+1) + "-" + v.time.getDate() + ' ' + v.time.getHours() ){
          ress[v.time.getFullYear()  + "-" + (v.time.getMonth()+1) + "-" + v.time.getDate() + ' ' + v.time.getHours()] = (ress[v.time.getFullYear()  + "-" + (v.time.getMonth()+1) + "-" + v.time.getDate() + ' ' + v.time.getHours()] || 0) + 1;
        }
        let d = v.time
        let se = d.getSeconds()
        let mi = d.getMinutes()
        let ho = d.getHours()
        if(se < 10){
          se = '0' + se;
        }
        if(mi < 10){
          mi = '0' + mi;
        }
        if(ho < 10){
          ho = '0' + ho;
        }
        d = d.getFullYear()  + "-" + (d.getMonth()+1) + "-" + d.getDate() + "_" + ho + ":" + mi + ":" + se;
        v['picture'] = `${d}_${v.track_id}.jpg`;
      }
            let a = {
          total: result.length,
          raw: result,
          over: ress
      }
      res.status(200).json({success: true, data: a})
    });
  })
}

exports.covered = (req, res) =>{
  
  let token = req.headers["x-access-token"];
  const data = req.body;
  jwt.verify(token, process.env.secret, (err, decoded) => {
     db.con().query(`SELECT * from alerts WHERE alert= 'no mask' and cam_id = '${req.params.id}' and time >= '${data.start}' and  time <= '${data.end}' order by time asc;`, function (err, result) {
      if (err) return res.status(500).json({success: false, message: err});
      let ress = {};
      let cache = '';
      for(var v of result){
        if(cache == ''){
          cache = v.time.getFullYear()  + "-" + (v.time.getMonth()+1) + "-" + v.time.getDate() + ' ' + v.time.getHours()
        }
        
        if(cache != v.time.getFullYear()  + "-" + (v.time.getMonth()+1) + "-" + v.time.getDate() + ' ' + v.time.getHours() ){
          
          while(cache != v.time.getFullYear()  + "-" + (v.time.getMonth()+1) + "-" + v.time.getDate() + ' ' + v.time.getHours() ){
            cache = new Date(cache + ':00:00')
            ress[cache.getFullYear()  + "-" + (cache.getMonth()+1) + "-" + cache.getDate() + ' ' +(cache.getHours() + 1)] = 0;
            cache = cache.getFullYear()  + "-" + (cache.getMonth()+1) + "-" + cache.getDate() + ' ' +(cache.getHours() + 1);
          }
        }
        if(cache == v.time.getFullYear()  + "-" + (v.time.getMonth()+1) + "-" + v.time.getDate() + ' ' + v.time.getHours() ){
          ress[v.time.getFullYear()  + "-" + (v.time.getMonth()+1) + "-" + v.time.getDate() + ' ' + v.time.getHours()] = (ress[v.time.getFullYear()  + "-" + (v.time.getMonth()+1) + "-" + v.time.getDate() + ' ' + v.time.getHours()] || 0) + 1;
        }
        let d = v.time
        let se = d.getSeconds()
        let mi = d.getMinutes()
        let ho = d.getHours()
        if(se < 10){
          se = '0' + se;
        }
        if(mi < 10){
          mi = '0' + mi;
        }
        if(ho < 10){
          ho = '0' + ho;
        }
        d = d.getFullYear()  + "-" + (d.getMonth()+1) + "-" + d.getDate() + "_" + ho + ":" + mi + ":" + se;
        v['picture'] = `${d}_${v.trackid}.jpg`;
      }
      let a = {
          total: result.length,
          raw: result,
          over: ress
      }
      res.status(200).json({success: true, data: a})
    });
  })
}

exports.social = (req, res) =>{
  
  let token = req.headers["x-access-token"];
  const data = req.body;
  jwt.verify(token, process.env.secret, (err, decoded) => {
     db.con().query(`SELECT * from alerts WHERE alert= 'sociald' and cam_id = '${req.params.id}' and time >= '${data.start}' and  time <= '${data.end}' order by time asc;`, function (err, result) {
      if (err) return res.status(500).json({success: false, message: err});
      let ress = {"0": 0, "1":0, "2": 0}
      let ressover = {};
      let cache = '';
      result.forEach(function(v) {
        if(cache == ''){
          cache = v.time.getFullYear()  + "-" + (v.time.getMonth()+1) + "-" + v.time.getDate() + ' ' + v.time.getHours()
        }
        
        if(cache != v.time.getFullYear()  + "-" + (v.time.getMonth()+1) + "-" + v.time.getDate() + ' ' + v.time.getHours() ){
          
          while(cache != v.time.getFullYear()  + "-" + (v.time.getMonth()+1) + "-" + v.time.getDate() + ' ' + v.time.getHours() ){
            cache = new Date(cache + ':00:00')
            ressover[cache.getFullYear()  + "-" + (cache.getMonth()+1) + "-" + cache.getDate() + ' ' +(cache.getHours() + 1)] = 0;
            cache = cache.getFullYear()  + "-" + (cache.getMonth()+1) + "-" + cache.getDate() + ' ' +(cache.getHours() + 1);
          }
        }
        if(cache == v.time.getFullYear()  + "-" + (v.time.getMonth()+1) + "-" + v.time.getDate() + ' ' + v.time.getHours() ){
          ressover[v.time.getFullYear()  + "-" + (v.time.getMonth()+1) + "-" + v.time.getDate() + ' ' + v.time.getHours()] = (ressover[v.time.getFullYear()  + "-" + (v.time.getMonth()+1) + "-" + v.time.getDate() + ' ' + v.time.getHours()] || 0) + 1;
        }
        ress[v.alert_type] = (ress[v.alert_type] || 0) + 1;
          let d = v.time
          let se = d.getSeconds()
          let mi = d.getMinutes()
          let ho = d.getHours()
          if(se < 10){
            se = '0' + se;
          }
          if(mi < 10){
            mi = '0' + mi;
          }
          if(ho < 10){
            ho = '0' + ho;
          }
          d = d.getFullYear()  + "-" + (d.getMonth()+1) + "-" + d.getDate() + "_" + ho + ":" + mi + ":" + se;
          v['picture'] = `${d}_${v.trackid}.jpg`;
      })
      let a = {
          total: result.length,
          raw: result,
          types: ress,
          over:ressover
      }
      res.status(200).json({success: true, data: a})
    });
  })
}

exports.pc = (req, res) =>{
  
  let token = req.headers["x-access-token"];
  const data = req.body;
  jwt.verify(token, process.env.secret, (err, decoded) => {
     db.con().query(`SELECT * from pcount WHERE cam_id = '${req.params.id}' and time >= '${data.start}' and  time <= '${data.end}' order by time asc;`, function (err, result) {
      if (err) return res.status(500).json({success: false, message: err});
      let ressEn = {}
      let ressEx = {}
      let avgi = 0;
      let mini = 0;
      let maxi = 0;
      let avgen = 0;
      let minen = 0;
      let maxen = 0;
      let avgex = 0;
      let minex = 0;
      let maxex = 0;
      let ins = 0;
      let totalEn = 0;
      let totalEx = 0;
      let label = [];
      let dain = [];
      let daen = [];
      let daex = [];
      result.forEach(function(v) {
        ressEn[v.time.getFullYear()  + "-" + (v.time.getMonth()+1) + "-" + v.time.getDate() + ' ' + v.time.getHours()] = v.count2
        ressEx[v.time.getFullYear()  + "-" + (v.time.getMonth()+1) + "-" + v.time.getDate() + ' ' + v.time.getHours()] = v.count1
        label.push(v.time)
        dain.push(v['count2'] - v['count1'])
        daen.push(v['count2'])
        daex.push(v['count1'])
        v['picture'] = 'name.jpg'
        v['inside'] = v['count2'] - v['count1']
        avgi = avgi + v['inside'];
        if(mini == 0){
          mini = v['inside']
        }else if(v['inside'] < mini){
          mini = v['inside']
        }
        if(maxi == 0){
          maxi = v['inside']
        }else if(v['inside'] > maxi){
          maxi = v['inside']
        }
        avgen = avgen + v.count2;
        if(minen == 0){
          minen = v.count2
        }else if(v.count2 < minen){
          minen = v.count2
        }
        if(maxen == 0){
          maxen = v.count2
        }else if(v.count2 > maxen){
          maxen = v.count2
        }
        avgex = avgex + v.count1;
        if(minex == 0){
          minex = v.count1
        }else if(v.count1 < minex){
          minex = v.count1
        }
        if(maxex == 0){
          maxex = v.count1
        }else if(v.count1 > maxex){
          maxex = v.count1
        }
      })
      avgi = Math.round((avgi/ result.length) * 100) / 100;
      avgen = Math.round((avgen/ result.length) * 100) / 100;
      avgex = Math.round((avgex/ result.length) * 100) / 100;
      if(result.length != 0){
        ins = result[result.length - 1]['count2'] - result[result.length - 1]['count1']
        totalEn = result[result.length - 1]['count2']
        totalEx = result[result.length - 1]['count1']
      }      
      if(ins < 0){
        ins = 0;
      }
      let a = {
          totalEn: totalEn,
          totalEx: totalEx,
          in: ins,
          avg: { in: avgi, en: avgen, ex: avgex},
          min: { in: mini, en: minen, ex: minex},
          max: { in: maxi, en: maxen, ex: maxex},
          raw: result,
          histogramEn: ressEn,
          histogramEx: ressEx,
          label: label,
          dataIn: dain,
          dataEn: daen,
          dataEx: daex
      }
      if(result.length == 0){
        return res.status(200).json({success: true, data: a})
      }
      res.status(200).json({success: true, data: a})
    });
  })
}

exports.helm = (req, res) =>{
  
  let token = req.headers["x-access-token"];
  const data = req.body;
  jwt.verify(token, process.env.secret, (err, decoded) => {
     db.con().query(`SELECT * from alerts WHERE alert= 'helmet' and cam_id = '${req.params.id}' and time >= '${data.start}' and  time <= '${data.end}' order by time asc;`, function (err, result) {
      if (err) return res.status(500).json({success: false, message: err});
      let ress = {};
      let cache = '';
      for(var v of result){
        if(cache == ''){
          cache = v.time.getFullYear()  + "-" + (v.time.getMonth()+1) + "-" + v.time.getDate() + ' ' + v.time.getHours()
        }
        
        if(cache != v.time.getFullYear()  + "-" + (v.time.getMonth()+1) + "-" + v.time.getDate() + ' ' + v.time.getHours() ){
          
          while(cache != v.time.getFullYear()  + "-" + (v.time.getMonth()+1) + "-" + v.time.getDate() + ' ' + v.time.getHours() ){
            cache = new Date(cache + ':00:00')
            ress[cache.getFullYear()  + "-" + (cache.getMonth()+1) + "-" + cache.getDate() + ' ' +(cache.getHours() + 1)] = 0;
            cache = cache.getFullYear()  + "-" + (cache.getMonth()+1) + "-" + cache.getDate() + ' ' +(cache.getHours() + 1);
          }
        }
        if(cache == v.time.getFullYear()  + "-" + (v.time.getMonth()+1) + "-" + v.time.getDate() + ' ' + v.time.getHours() ){
          ress[v.time.getFullYear()  + "-" + (v.time.getMonth()+1) + "-" + v.time.getDate() + ' ' + v.time.getHours()] = (ress[v.time.getFullYear()  + "-" + (v.time.getMonth()+1) + "-" + v.time.getDate() + ' ' + v.time.getHours()] || 0) + 1;
        }
        let d = v.time
        let se = d.getSeconds()
        let mi = d.getMinutes()
        let ho = d.getHours()
        if(se < 10){
          se = '0' + se;
        }
        if(mi < 10){
          mi = '0' + mi;
        }
        if(ho < 10){
          ho = '0' + ho;
        }
        d = d.getFullYear()  + "-" + (d.getMonth()+1) + "-" + d.getDate() + "_" + ho + ":" + mi + ":" + se;
        v['picture'] = `${d}_${v.trackid}.jpg`;
      }
      let a = {
          total: result.length,
          raw: result,
          over: ress
      }
      res.status(200).json({success: true, data: a})
    });
  })
}


exports.queue = (req, res) =>{

  function display (seconds) {
    const format = val => `0${Math.floor(val)}`.slice(-2)
    const hours = seconds / 3600
    const minutes = (seconds % 3600) / 60
  
    return [hours, minutes, seconds % 60].map(format).join(':')
  }

  const data = req.body;
     db.con().query(`SELECT * from queue_mgt WHERE cam_id = '${req.params.id}' and start_time >= '${data.start}' and  start_time <= '${data.end}' order by start_time asc;`, function (err, result) {
      if (err) return res.status(500).json({success: false, message: err});
      let countIn = 0;
      let avg = 0;
      let min = 0;
      let max = 0;
      let minQ, maxQ;
      let times = []
      for(var v of result){
        if(v.queuing == 1){
          countIn++
        }else{
          v['wait'] = (v.end_time - v.start_time)/1000;
          v['wait'] = display(v['wait'])
         times.push({time: (v.end_time - v.start_time)/60000, queue: v.zone})
        }
        let d = v.start_time
        let se = d.getSeconds()
        let mi = d.getMinutes()
        let ho = d.getHours()
        if(se < 10){
          se = '0' + se;
        }
        if(mi < 10){
          mi = '0' + mi;
        }
        if(ho < 10){
          ho = '0' + ho;
        }
        d = d.getFullYear()  + "-" + (d.getMonth()+1) + "-" + d.getDate() + "_" + ho + ":" + mi + ":" + se;
        v['picture'] = `${d}_${v.trackid}.jpg`;
      }
      for(var e of times){
        avg = avg + e.time;
        if(min == 0){
          min = e.time;
          minQ = e.queue;
        }else if(e.time < min){
          min = e.time;
          minQ = e.queue;
        }
        if(max == 0){
          max = e.time
          maxQ = e.queue
        }else if(e.time > max){
          max = e.time
          maxQ = e.queue
        }
      }
      let a = {
          raw: result,
          count: countIn,
          avg: Math.round((avg/ times.length) * 100) / 100,
          min: minQ,
          max: maxQ,
      }
      res.status(200).json({success: true, data: a})
    });

}