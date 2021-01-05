require('dotenv').config({ path: '../../config.env'});
const db1 = require("../models");
var jwt = require("jsonwebtoken");
var db=require('../models/dbmysql');
const Relation = db1.relation

exports.loitering = async (req, res) =>{
  
    let token = req.headers["x-access-token"];
    const data = req.body;
    jwt.verify(token, process.env.secret, async (err, decoded) => {
      let wh;
      if(decoded.id_branch != 0000){
        wh = {id_branch: decoded.id_branch, algo_id : 2 }
      }else{
        wh = {id_account: decoded.id_account, algo_id : 2 }
      }
        Relation.findOne({
            where: wh
          }).then(async rel => {
      await db.con().query(`SELECT * from loitering WHERE ${data.type} = '${req.params.id}' and time >= '${data.start}' and  time <= '${data.end}' order by time asc;`, function (err, result) {
        if (err) return res.status(500).json({success: false, message: err});
        let days = Math.round((new Date(data.end) - new Date(data.start))/(1000 * 60 * 60 * 24));
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
            v['clip_path'] = `${d}_${v.track_id}.mp4`;
          })
          avg = Math.round((avg/ result.length) * 100) / 100;
        let av = result.length/(24 * days)
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

exports.intrude = async (req, res) =>{

  const data = req.body;
    await db.con().query(`SELECT * from intrude WHERE ${data.type} = '${req.params.id}' and time >= '${data.start}' and  time <= '${data.end}' order by time asc;`, function (err, result) {
      if (err) return res.status(500).json({success: false, message: err});
      let days = Math.round((new Date(data.end) - new Date(data.start))/(1000 * 60 * 60 * 24));
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
            let t = new Date(cache + ':00:00').getTime();
            t += (60 * 60*1000)
            cache = new Date(t)
            ressover[cache.getFullYear()  + "-" + (cache.getMonth()+1) + "-" + cache.getDate() + ' ' +(cache.getHours())] = 0;
            cache = cache.getFullYear()  + "-" + (cache.getMonth()+1) + "-" + cache.getDate() + ' ' +(cache.getHours());
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
        v['clip_path'] = `${d}_${v.track_id}_zone${v.zone}.mp4`;
      })
      let lo = []
      for(var l of Object.keys(ress)){
        lo.push({name: l, value: ress[l], perc: JSON.stringify(Math.round((ress[l]/result.length) * 100)) + '%'})
      }
      let av = result.length/(24 * days)
      let a = {
          total: result.length,
          avgH: Math.round(av * 100) / 100,
          raw: result,
          donut: lo,
          over: ressover
      }
      res.status(200).json({success: true, data: a})
    });
}

exports.violence = async (req, res) =>{

  const data = req.body;

     await db.con().query(`SELECT * from violence WHERE ${data.type} = '${req.params.id}' and time >= '${data.start}' and  time <= '${data.end}' order by time asc;`, function (err, result) {
      if (err) return res.status(500).json({success: false, message: err});
      let ress = {};
      let cache = '';
      for(var v of result){
        if(cache == ''){
          cache = v.time.getFullYear()  + "-" + (v.time.getMonth()+1) + "-" + v.time.getDate() + ' ' + v.time.getHours()
        }
        
        if(cache != v.time.getFullYear()  + "-" + (v.time.getMonth()+1) + "-" + v.time.getDate() + ' ' + v.time.getHours() ){
          
          while(cache != v.time.getFullYear()  + "-" + (v.time.getMonth()+1) + "-" + v.time.getDate() + ' ' + v.time.getHours() ){
            let t = new Date(cache + ':00:00').getTime();
            //Add one hours to date
            t += (60 * 60*1000)
            cache = new Date(t)
            ress[cache.getFullYear()  + "-" + (cache.getMonth()+1) + "-" + cache.getDate() + ' ' +(cache.getHours())] = 0;
            cache = cache.getFullYear()  + "-" + (cache.getMonth()+1) + "-" + cache.getDate() + ' ' +(cache.getHours());
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
        v['clip_path'] = `${d}.mp4`;
      }
      let a = {
          total: result.length,
          raw: result,
          over: ress
      }
      res.status(200).json({success: true, data: a})
    });
}

exports.aod = async (req, res) =>{
  
  const data = req.body;
    await db.con().query(`SELECT * from aod WHERE ${data.type} = '${req.params.id}' and time >= '${data.start}' and  time <= '${data.end}' order by time asc;`, function (err, result) {
      if (err) return res.status(500).json({success: false, message: err});
      let ress = {}
      let cache = '';
      for(var v of result){
        if(cache == ''){
          cache = v.time.getFullYear()  + "-" + (v.time.getMonth()+1) + "-" + v.time.getDate() + ' ' + v.time.getHours()
        }
        
        if(cache != v.time.getFullYear()  + "-" + (v.time.getMonth()+1) + "-" + v.time.getDate() + ' ' + v.time.getHours() ){
          
          while(cache != v.time.getFullYear()  + "-" + (v.time.getMonth()+1) + "-" + v.time.getDate() + ' ' + v.time.getHours() ){
            let t = new Date(cache + ':00:00').getTime();
            //Add one hours to date
            t += (60 * 60*1000)
            cache = new Date(t)
            ress[cache.getFullYear()  + "-" + (cache.getMonth()+1) + "-" + cache.getDate() + ' ' +(cache.getHours())] = 0;
            cache = cache.getFullYear()  + "-" + (cache.getMonth()+1) + "-" + cache.getDate() + ' ' +(cache.getHours());
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
        v['clip_path'] = `${d}_${v.track_id}.mp4`;
      }
      const a = {
          total: result.length,
          raw: result,
          over: ress
      }
      res.status(200).json({success: true, data: a})
    });
}

exports.covered = async (req, res) =>{
  const data = req.body;

    await db.con().query(`SELECT * from alerts WHERE alert= 'no mask' and ${data.type} = '${req.params.id}' and time >= '${data.start}' and  time <= '${data.end}' order by time asc;`, function (err, result) {
      if (err) return res.status(500).json({success: false, message: err});
      let ress = {};
      let cache = '';
      for(var v of result){
        if(cache == ''){
          cache = v.time.getFullYear()  + "-" + (v.time.getMonth()+1) + "-" + v.time.getDate() + ' ' + v.time.getHours()
        }
        
        if(cache != v.time.getFullYear()  + "-" + (v.time.getMonth()+1) + "-" + v.time.getDate() + ' ' + v.time.getHours() ){
          while(cache != v.time.getFullYear()  + "-" + (v.time.getMonth()+1) + "-" + v.time.getDate() + ' ' + v.time.getHours() ){
            let t = new Date(cache + ':00:00').getTime();
            //Add one hours to date
            t += (60 * 60*1000)
            cache = new Date(t)
            ress[cache.getFullYear()  + "-" + (cache.getMonth()+1) + "-" + cache.getDate() + ' ' +(cache.getHours())] = 0;
            cache = cache.getFullYear()  + "-" + (cache.getMonth()+1) + "-" + cache.getDate() + ' ' +(cache.getHours());
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
        v['clip_path'] = `${d}_${v.track_id}.mp4`;
      }
      let a = {
          total: result.length,
          raw: result,
          over: ress
      }
      res.status(200).json({success: true, data: a})
    });
}

exports.social = async (req, res) =>{
  const data = req.body;
    await db.con().query(`SELECT * from alerts WHERE alert= 'sociald' and ${data.type} = '${req.params.id}' and time >= '${data.start}' and  time <= '${data.end}' order by time asc;`, function (err, result) {
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
            let t = new Date(cache + ':00:00').getTime();
            //Add one hours to date
            t += (60 * 60*1000)
            cache = new Date(t)
            ressover[cache.getFullYear()  + "-" + (cache.getMonth()+1) + "-" + cache.getDate() + ' ' +(cache.getHours())] = 0;
            cache = cache.getFullYear()  + "-" + (cache.getMonth()+1) + "-" + cache.getDate() + ' ' +(cache.getHours());
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
          v['clip_path'] = `${d}_${v.track_id}.mp4`;
      })
      let a = {
          total: result.length,
          raw: result,
          types: ress,
          over:ressover
      }
      res.status(200).json({success: true, data: a})
    });
}

exports.pc = async (req, res) =>{
  const data = req.body;
  const ressEn = {}
  const ressEx = {}
  var avgi = 0;
  var mini = 0;
  var maxi = 0;
  var avgen = 0;
  var minen = 0;
  var maxen = 0;
  var avgex = 0;
  var minex = 0;
  var maxex = 0;
  var ins = 0;
  var totalEn = 0;
  var totalEx = 0;
  const label = [];
  const dain = [];
  const daen = [];
  const daex = [];
    await db.con().query(`SELECT * from pcount WHERE ${data.type} = '${req.params.id}' and time >= '${data.start}' and  time <= '${data.end}' order by time asc;`, function (err, result) {
      if (err) return res.status(500).json({success: false, message: err});
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
}

exports.helm = async (req, res) =>{

  const data = req.body;

     await db.con().query(`SELECT * from alerts WHERE alert= 'helmet' and ${data.type} = '${req.params.id}' and time >= '${data.start}' and  time <= '${data.end}' order by time asc;`, function (err, result) {
      if (err) return res.status(500).json({success: false, message: err});
      let ress = {};
      let cache = '';
      for(var v of result){
        if(cache == ''){
          cache = v.time.getFullYear()  + "-" + (v.time.getMonth()+1) + "-" + v.time.getDate() + ' ' + v.time.getHours()
        }
        
        if(cache != v.time.getFullYear()  + "-" + (v.time.getMonth()+1) + "-" + v.time.getDate() + ' ' + v.time.getHours() ){
          
          while(cache != v.time.getFullYear()  + "-" + (v.time.getMonth()+1) + "-" + v.time.getDate() + ' ' + v.time.getHours() ){
            let t = new Date(cache + ':00:00').getTime();
            //Add one hours to date
            t += (60 * 60*1000)
            cache = new Date(t)
            ress[cache.getFullYear()  + "-" + (cache.getMonth()+1) + "-" + cache.getDate() + ' ' +(cache.getHours())] = 0;
            cache = cache.getFullYear()  + "-" + (cache.getMonth()+1) + "-" + cache.getDate() + ' ' +(cache.getHours());
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
        v['clip_path'] = `${d}_${v.track_id}.mp4`;
      }
      let a = {
          total: result.length,
          raw: result,
          over: ress
      }
      res.status(200).json({success: true, data: a})
    });
}

function display (seconds) {
  const format = val => `0${Math.floor(val)}`.slice(-2)
  const hours = seconds / 3600
  const minutes = (seconds % 3600) / 60

  return [hours, minutes, seconds % 60].map(format).join(':')
}

exports.queue = async (req, res) =>{
  const data = req.body;
     await db.con().query(`SELECT * from queue_mgt WHERE ${data.type} = '${req.params.id}' and start_time >= '${data.start}' and  start_time <= '${data.end}' order by start_time asc;`, function (err, result) {
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
         times.push({time: (v.end_time - v.start_time)/60000, queue: v.qid})
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
        v['picture'] = `${d}_${v.track_id}.jpg`;
        v['clip_path'] = `${d}_${v.track_id}.mp4`;
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

exports.queueLite = async (req, res) =>{
  const data = req.body;
     await db.con().query(`SELECT date_format(SEC_TO_TIME(AVG(TIME_TO_SEC(difference))), '%H:%i:%S') as avarage from (SELECT timediff(end_time, start_time) as difference FROM multi_tenant.queue_mgt where ${data.type} = '${req.params.id}' and queuing = 0 and start_time >= '${data.start}' and  start_time <= '${data.end}') t;`,async function (err, result) {
      if (err) return res.status(500).json({success: false, message: err});
      await db.con().query(`SELECT count(queuing) as count FROM multi_tenant.queue_mgt where ${data.type} = '${req.params.id}' and queuing = 1 and start_time >= '${data.start}' and  start_time <= '${data.end}';`, function (err2, result2) {
        if (err2) return res.status(500).json({success: false, message: err2});
      const a = {
        avg: result[0].avarage,
        count: result2[0].count
      }
      res.status(200).json({success: true, data: a})
    });
  });
}

exports.pcLite = async (req, res) =>{
  const data = req.body;
     await db.con().query(`SELECT (count2 - count1) as count FROM pcount where ${data.type} = '${req.params.id}' and time >= '${data.start}' and  time <= '${data.end}' order by time desc limit 1;`,async function (err, result) {
      if (err) return res.status(500).json({success: false, message: err});
      var cou = 0;
      if(result.length != 0){
        cou = result[0].count
      }      
      const a = {
        currentCount: cou,
      }
      res.status(200).json({success: true, data: a})

  });
}

exports.premises = async (req, res) =>{
  const data = req.body;
     await db.con().query(`SELECT HOUR(start_time) as hour, COUNT(*) as count FROM queue_mgt where ${data.type} = '${req.params.id}' and start_time >= '${data.start}' and  start_time <= '${data.end}' GROUP BY HOUR(start_time);`, async function (err, result0) {
      if (err) return res.status(500).json({success: false, message: err});
      await db.con().query(`SELECT HOUR(time) as hour, COUNT(*) as count FROM pcount where ${data.type} = '${req.params.id}' and time >= '${data.start}' and  time <= '${data.end}' GROUP BY HOUR(time);`, async function (err, result1) {
        if (err) return res.status(500).json({success: false, message: err});
        await db.con().query(`SELECT HOUR(time) as hour, COUNT(*) as count FROM loitering where ${data.type} = '${req.params.id}' and time >= '${data.start}' and  time <= '${data.end}' GROUP BY HOUR(time);`, async function (err, result2) {
          if (err) return res.status(500).json({success: false, message: err});
          await db.con().query(`SELECT HOUR(time) as hour, COUNT(*) as count FROM vault where ${data.type} = '${req.params.id}' and time >= '${data.start}' and  time <= '${data.end}' GROUP BY HOUR(time);`, async function (err, result3) {
            if (err) return res.status(500).json({success: false, message: err});
            let arr = [{hour:0, count:0},{hour:1, count:0},{hour:2, count:0},{hour:3, count:0},{hour:4, count:0},{hour:5, count:0},{hour:6, count:0},{hour:7, count:0},{hour:8, count:0},{hour:9, count:0},{hour:10, count:0},{hour:11, count:0},{hour:12, count:0},{hour:13, count:0},{hour:14, count:0},{hour:15, count:0},{hour:16, count:0},{hour:17, count:0},{hour:18, count:0},{hour:19, count:0},{hour:20, count:0},{hour:21, count:0},{hour:22, count:0},{hour:23, count:0}]
            let res0 = {}
            let res1 = {}
            let res2 = {}
            let res3 = {}
            let a = 0
            let b = 0
            let c = 0
            let d = 0
            for(let i = 0; i < arr.length; i++){
              if(result0[a].hour != arr[i].hour){
                res0[arr[i].hour] = arr[i].count
              }else{
                res0[arr[i].hour] = result0[a].count
                if(a < result0.length - 1)
                a++;
              }

              if(result1[b].hour != arr[i].hour){
                res1[arr[i].hour] = arr[i].count
              }else{
                res1[arr[i].hour] = result1[b].count
                if(b < result1.length - 1)
                b++;
              }

              if(result2[c].hour != arr[i].hour){
                res2[arr[i].hour] = arr[i].count
              }else{
                res2[arr[i].hour] = result2[c].count
                if(c < result2.length - 1)
                c++;
              }
              if(result3[d].hour != arr[i].hour){
                res3[arr[i].hour] = arr[i].count
              }else{
                res3[arr[i].hour] = result3[d].count
                if(d < result3.length - 1)
                d++;
              }
            }

      const send = {
        queue: res0,
        pcount: res1,
        loit: res2,
        vault: res3
      }
      res.status(200).json({success: true, data: send})
    });
    });
    });
  });
}

exports.threats = async (req, res) =>{
  const data = req.body;
     await db.con().query(`SELECT HOUR(time) as hour, COUNT(*) as count FROM violence where ${data.type} = '${req.params.id}' and time >= '${data.start}' and  time <= '${data.end}' GROUP BY HOUR(time);`, async function (err, result0) {
      if (err) return res.status(500).json({success: false, message: err});
      await db.con().query(`SELECT HOUR(time) as hour, COUNT(*) as count FROM alerts where alert = 'helmet' and ${data.type} = '${req.params.id}' and time >= '${data.start}' and  time <= '${data.end}' GROUP BY HOUR(time);`, async function (err, result1) {
        if (err) return res.status(500).json({success: false, message: err});
        await db.con().query(`SELECT HOUR(time) as hour, COUNT(*) as count FROM alerts where alert = 'no mask' and ${data.type} = '${req.params.id}' and time >= '${data.start}' and  time <= '${data.end}' GROUP BY HOUR(time);`, async function (err, result2) {
          if (err) return res.status(500).json({success: false, message: err});
          await db.con().query(`SELECT HOUR(time) as hour, COUNT(*) as count FROM aod where ${data.type} = '${req.params.id}' and time >= '${data.start}' and  time <= '${data.end}' GROUP BY HOUR(time);`, async function (err, result3) {
            if (err) return res.status(500).json({success: false, message: err});
            await db.con().query(`SELECT HOUR(time) as hour, COUNT(*) as count FROM alerts where alert = 'sociald' and ${data.type} = '${req.params.id}' and time >= '${data.start}' and  time <= '${data.end}' GROUP BY HOUR(time);`, async function (err, result4) {
              if (err) return res.status(500).json({success: false, message: err});
              await db.con().query(`SELECT HOUR(time) as hour, COUNT(*) as count FROM intrude where ${data.type} = '${req.params.id}' and time >= '${data.start}' and  time <= '${data.end}' GROUP BY HOUR(time);`, async function (err, result5) {
                if (err) return res.status(500).json({success: false, message: err});
            let arr = [{hour:0, count:0},{hour:1, count:0},{hour:2, count:0},{hour:3, count:0},{hour:4, count:0},{hour:5, count:0},{hour:6, count:0},{hour:7, count:0},{hour:8, count:0},{hour:9, count:0},{hour:10, count:0},{hour:11, count:0},{hour:12, count:0},{hour:13, count:0},{hour:14, count:0},{hour:15, count:0},{hour:16, count:0},{hour:17, count:0},{hour:18, count:0},{hour:19, count:0},{hour:20, count:0},{hour:21, count:0},{hour:22, count:0},{hour:23, count:0}]
            let res0 = {}
            let res1 = {}
            let res2 = {}
            let res3 = {}
            let res4 = {}
            let res5 = {}
            let a = 0
            let b = 0
            let c = 0
            let d = 0
            let e = 0
            let f = 0
            for(let i = 0; i < arr.length; i++){
              if(result0[a].hour != arr[i].hour){
                res0[arr[i].hour] = arr[i].count
              }else{
                res0[arr[i].hour] = result0[a].count
                if(a < result0.length - 1)
                a++;
              }

              if(result1[b].hour != arr[i].hour){
                res1[arr[i].hour] = arr[i].count
              }else{
                res1[arr[i].hour] = result1[b].count
                if(b < result1.length - 1)
                b++;
              }

              if(result2[c].hour != arr[i].hour){
                res2[arr[i].hour] = arr[i].count
              }else{
                res2[arr[i].hour] = result2[c].count
                if(c < result2.length - 1)
                c++;
              }

              if(result3[d].hour != arr[i].hour){
                res3[arr[i].hour] = arr[i].count
              }else{
                res3[arr[i].hour] = result3[d].count
                if(d < result3.length - 1)
                d++;
              }

              if(result4[e].hour != arr[i].hour){
                res4[arr[i].hour] = arr[i].count
              }else{
                res4[arr[i].hour] = result4[e].count
                if(e < result4.length - 1)
                e++;
              }

              if(result5[f].hour != arr[i].hour){
                res5[arr[i].hour] = arr[i].count
              }else{
                res5[arr[i].hour] = result5[f].count
                if(f < result5.length - 1)
                f++;
              }
            }

      const send = {
        violence: res0,
        helmet: res1,
        covered: res2,
        aod: res3,
        social: res4,
        intr: res5
      }
      res.status(200).json({success: true, data: send})
    });
    });
    });
    });
    });
  });
}

exports.vault = async (req, res) =>{

  const data = req.body;

     await db.con().query(`SELECT * from vault WHERE  ${data.type} = '${req.params.id}' and time >= '${data.start}' and  time <= '${data.end}' order by time asc;`, function (err, result) {
      if (err) return res.status(500).json({success: false, message: err});
      let days = Math.round((new Date(data.end) - new Date(data.start))/(1000 * 60 * 60 * 24));
      let ress = {};
      let cache = '';
      let organized = [];
      for(var v of result){
        if(cache == ''){
          cache = v.time.getFullYear()  + "-" + (v.time.getMonth()+1) + "-" + v.time.getDate() + ' ' + v.time.getHours()
        }
        
        if(cache != v.time.getFullYear()  + "-" + (v.time.getMonth()+1) + "-" + v.time.getDate() + ' ' + v.time.getHours() ){
          
          while(cache != v.time.getFullYear()  + "-" + (v.time.getMonth()+1) + "-" + v.time.getDate() + ' ' + v.time.getHours() ){
            let t = new Date(cache + ':00:00').getTime();
            //Add one hours to date
            t += (60 * 60*1000)
            cache = new Date(t)
            ress[cache.getFullYear()  + "-" + (cache.getMonth()+1) + "-" + cache.getDate() + ' ' +(cache.getHours())] = 0;
            cache = cache.getFullYear()  + "-" + (cache.getMonth()+1) + "-" + cache.getDate() + ' ' +(cache.getHours());
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
        if(v.open == 1){
          v['time_in'] = v['time']
          organized.push(v)
        }else {
          organized[organized.length - 1]['time_out'] = v['time']
        }
      }
      if(organized[organized.length - 1]['time_out'] == undefined){
        organized[organized.length - 1]['time_out'] = new Date();
      }
      for(var t of organized){
        t['duration'] = (t.time_out - t.time_in)/1000;
        t['duration'] = display(t['duration'])
      }
      let av = result.length/(24 * days)
      let a = {
          total: result.length,
          avg: Math.round(av * 100) / 100,
          raw: result,
          org: organized,
          over: ress
      }
      res.status(200).json({success: true, data: a})
    });
}

exports.parking = async (req, res) =>{
  
  const data = req.body;
    await db.con().query(`SELECT * from alerts WHERE alert = 'park' and ${data.type} = '${req.params.id}' and time >= '${data.start}' and  time <= '${data.end}' order by time asc;`, function (err, result) {
      if (err) return res.status(500).json({success: false, message: err});
      for(var v of result){

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
      const a = {
          total: result.length,
          raw: result
      }
      res.status(200).json({success: true, data: a})
    });
}

exports.anpr = async (req, res) =>{
  
  const data = req.body;
    await db.con().query(`SELECT * from plate WHERE ${data.type} = '${req.params.id}' and time >= '${data.start}' and  time <= '${data.end}' order by time asc;`, function (err, result) {
      if (err) return res.status(500).json({success: false, message: err});
      for(var v of result){

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
      const a = {
          total: result.length,
          raw: result
      }
      res.status(200).json({success: true, data: a})
    });
}


exports.barrier = async (req, res) =>{
  
  const data = req.body;
    await db.con().query(`SELECT * from barrier WHERE ${data.type} = '${req.params.id}' and time >= '${data.start}' and  time <= '${data.end}' order by time asc;`, function (err, result) {
      if (err) return res.status(500).json({success: false, message: err});
      for(var v of result){

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
      const a = {
          total: result.length,
          raw: result
      }
      res.status(200).json({success: true, data: a})
    });
}

exports.vc = async (req, res) =>{
  const data = req.body;
  const ressEn = {}
  const ressEx = {}
  var avgi = 0;
  var mini = 0;
  var maxi = 0;
  var avgen = 0;
  var minen = 0;
  var maxen = 0;
  var avgex = 0;
  var minex = 0;
  var maxex = 0;
  var ins = 0;
  var totalEn = 0;
  var totalEx = 0;
  const label = [];
  const dain = [];
  const daen = [];
  const daex = [];
    await db.con().query(`SELECT * from vcount WHERE ${data.type} = '${req.params.id}' and time >= '${data.start}' and  time <= '${data.end}' order by time asc;`, function (err, result) {
      if (err) return res.status(500).json({success: false, message: err});
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
}