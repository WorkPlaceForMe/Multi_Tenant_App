require('dotenv').config({ path: '../../config.env'});
var jwt = require("jsonwebtoken");
var db = require('../models/dbmysql');
const dateFormat = require('dateformat');

let count = {
  st0: 0,  // st0 - Total Alerts remaining
  st1: 0,  // st1 - Total Alerts solved
  l0: 0,   // l0 - low level alerts
  l0r: 0,  // l0r - low level alerts remaining
  l1: 0,   // l1 - Medium level
  l1r: 0,  // l1r - Medium rem
  l2: 0,   // l2 - high level
  l2r: 0,
};

exports.getAll = (req, res) =>{
    const data = req.query;
    let token = req.headers["x-access-token"];
    let id = Array.isArray(data.id) ? data.id[data.id.length-1] : data.id;
    let type = Array.isArray(data.type) ? data.type[data.type.length-1] : data.type;
    let page = parseInt(data._page);
    let limit = parseInt(data._limit);
    let offset = (page-1) * limit;
    let _sort = Array.isArray(data._sort) ? data._sort[data._sort.length-1] : data._sort;
    let _order = Array.isArray(data._order) ? data._order[data._order.length-1] : data._order;

    jwt.verify(token, process.env.secret, async(err, decoded) => {
      let promise1 = new Promise((resolve, reject) => {
        db.con().query(`SELECT count(*) as count FROM tickets WHERE ${type} = '${id}';`, (err, resp) => {
          resolve(resp[0].count);
        });
      });
      let promise2 = new Promise((resolve, reject) => {
        db.con().query(`SELECT type, createdAt, updatedAt, assigned, level, reviewed, assignedBy FROM tickets WHERE BINARY ${type} = '${id}' ORDER BY ${_sort} ${_order} LIMIT ${limit} OFFSET ${offset};`, (err, resp) => {
          resolve(resp);
        });
      });
      Promise.all([promise1, promise2])
      .then(values => {
        values[1].forEach(element => {
          element.createdAt = dateFormat(element.createdAt, 'yyyy-mm-dd HH:MM:ss');
          element.updatedAt = dateFormat(element.updatedAt, 'yyyy-mm-dd HH:MM:ss');
          if(element.createdAt === element.updatedAt) {
            element.updatedAt = '';
          }
          switch(element['type']){
            case 'loitering':{
              element['type'] = 'Loitering Detection';
              break;
            }
            case 'intrusion':{
              element['type'] = 'Intrusion Detection';
              break;
            }
            case 'aod':{
              element['type'] = 'Abandoned Object Detection';
              break;
            }
          }
        })
        res.status(200).json({success: true, data: values[1], total: values[0]});
      })
      .catch(error => {
        throw error;
      });
    });
}

var getAllTickets = async(row_count, type, id, data, res) => {
  let page = parseInt(data._page);
  let limit = parseInt(data._limit);
  let offset = (row_count === (page*limit)) ? (page-1) * limit : (page-1) * limit;
  let _sort = Array.isArray(data._sort) ? data._sort[data._sort.length-1] : data._sort;
  let _order = Array.isArray(data._order) ? data._order[data._order.length-1] : data._order;
  await db.con().query(`SELECT type, createdAt, updatedAt, assigned, level, reviewed, assignedBy FROM tickets WHERE BINARY ${type} = '${id}' ORDER BY ${_sort} ${_order} LIMIT ${limit} OFFSET ${offset};`, function (err, result) {
    if (err) return res.status(500).json({success: false, message: err});
    result.forEach(element => {
      element.createdAt = dateFormat(element.createdAt, 'yyyy-mm-dd HH:MM:ss');
      element.updatedAt = dateFormat(element.updatedAt, 'yyyy-mm-dd HH:MM:ss');
      if(element.createdAt === element.updatedAt) {
        element.updatedAt = '';
      }
      switch(element['type']){
        case 'loitering':{
          element['type'] = 'Loitering Detection';
          break;
        }
        case 'intrusion':{
          element['type'] = 'Intrusion Detection';
          break;
        }
        case 'aod':{
          element['type'] = 'Abandoned Object Detection';
          break;
        }
      }
    })
    res.status(200).json({success: true, data: result, total: row_count});
  });
}

exports.searchAllTickets = (req, res) => {
  const data = req.query;
  let token = req.headers["x-access-token"];
  let id = Array.isArray(data.id) ? data.id[data.id.length-1] : data.id;
  let type = Array.isArray(data.type) ? data.type[data.type.length-1] : data.type;
  let searchStr = Array.isArray(data.searchStr) ? data.searchStr[data.searchStr.length-1] : data.searchStr;
  let searchField = Array.isArray(data.searchField) ? data.searchField[data.searchField.length-1] : data.searchField;
  let page = parseInt(data._page);
  let limit = parseInt(data._limit);
  let offset = (page-1) * limit;
  let _sort = Array.isArray(data._sort) ? data._sort[data._sort.length-1] : data._sort;
  let _order = Array.isArray(data._order) ? data._order[data._order.length-1] : data._order;
  if(searchStr === 'Loitering Detection') {
    searchStr = 'loitering';
  } else if(searchStr === 'Intrusion Detection') {
    searchStr = 'intrusion';
  } else if(searchStr === 'Abandoned Object Detection') {
    searchStr = 'aod';
  }
  jwt.verify(token, process.env.secret, async(err, decoded) => {
    /* await db.con().query(`SELECT count(*) as count FROM tickets WHERE ${type} = '${id}' AND ${searchField} = '${searchStr}';`, function(err, resp) {
      search_total_row_count = resp[0].count;
      searchTickets(search_total_row_count, type, id, searchField, searchStr, data, res);
    }); */
    let promise1 = new Promise((resolve, reject) => {
      db.con().query(`SELECT count(*) as count FROM tickets WHERE ${type} = '${id}' AND ${searchField} = '${searchStr}';`, (err, resp) => {
        resolve(resp[0].count);
      });
    });
    let promise2 = new Promise((resolve, reject) => {
      db.con().query(`SELECT type, createdAt, updatedAt, assigned, level, reviewed, assignedBy FROM tickets WHERE BINARY ${type} = '${id}' AND ${searchField} = '${searchStr}' ORDER BY ${_sort} ${_order} LIMIT ${limit} OFFSET ${offset};`, (err, resp) => {
        resolve(resp);
      });
    });
    Promise.all([promise1, promise2])
    .then(values => {
      values[1].forEach(element => {
        element.createdAt = dateFormat(element.createdAt, 'yyyy-mm-dd HH:MM:ss');
        element.updatedAt = dateFormat(element.updatedAt, 'yyyy-mm-dd HH:MM:ss');
        if(element.createdAt === element.updatedAt) {
          element.updatedAt = '';
        }
        switch(element['type']){
          case 'loitering':{
            element['type'] = 'Loitering Detection';
            break;
          }
          case 'intrusion':{
            element['type'] = 'Intrusion Detection';
            break;
          }
          case 'aod':{
            element['type'] = 'Abandoned Object Detection';
            break;
          }
        }
      })
      res.status(200).json({success: true, data: values[1], total: values[0]});
    })
    .catch(error => {
      throw error;
    });
  });
}

var searchTickets = async(row_count, type, id, searchField, searchStr, data, res) => {
  let page = parseInt(data._page);
  let limit = parseInt(data._limit);
  let offset = (row_count === (page*limit)) ? (page-1) * limit : (page-1) * limit;
  let _sort = Array.isArray(data._sort) ? data._sort[data._sort.length-1] : data._sort;
  let _order = Array.isArray(data._order) ? data._order[data._order.length-1] : data._order;
  
  await db.con().query(`SELECT * FROM tickets WHERE BINARY ${type} = '${id}' AND ${searchField} = '${searchStr}' ORDER BY ${_sort} ${_order} LIMIT ${limit} OFFSET ${offset};`, function (err, result) {
    if (err) return res.status(500).json({success: false, message: err});
    result.forEach(element => {
      element.createdAt = dateFormat(element.createdAt, 'yyyy-mm-dd HH:MM:ss');
      element.updatedAt = dateFormat(element.updatedAt, 'yyyy-mm-dd HH:MM:ss');
      if(element.createdAt === element.updatedAt) {
        element.updatedAt = '';
      }
      switch(element['type']){
        case 'loitering':{
          element['type'] = 'Loitering Detection';
          break;
        }
        case 'intrusion':{
          element['type'] = 'Intrusion Detection';
          break;
        }
        case 'aod':{
          element['type'] = 'Abandoned Object Detection';
          break;
        }
      }
    })
    res.status(200).json({success: true, data: result, total: row_count});
  });
}

exports.alertsOverview = async(req, res) => {
  const data = req.query;
  let token = req.headers["x-access-token"];
  let id = Array.isArray(data.id) ? data.id[data.id.length-1] : data.id;
  let type = Array.isArray(data.type) ? data.type[data.type.length-1] : data.type;
  jwt.verify(token, process.env.secret, async(err, decoded) => {
    let st0 = new Promise((resolve, reject) => {
      db.con().query(`select count(*) as count from tickets where ${type} = '${id}' and createdAt = updatedAt;`, (err, resp) => {
        resolve(resp[0].count);
      });
    });
    let st1 = new Promise((resolve, reject) => {
      db.con().query(`select count(*) as count from tickets where ${type} = '${id}' and createdAt != updatedAt;`, (err, resp) => {
        resolve(resp[0].count);
      });
    });
    let l0 = new Promise((resolve, reject) => {
      db.con().query(`select count(*) as count from tickets where ${type} = '${id}' and level=0;`, (err, resp) => {
        resolve(resp[0].count);
      });
    });
    let l1 = new Promise((resolve, reject) => {
      db.con().query(`select count(*) as count from tickets where ${type} = '${id}' and level=1;`, (err, resp) => {
        resolve(resp[0].count);
      });
    });
    let l2 = new Promise((resolve, reject) => {
      db.con().query(`select count(*) as count from tickets where ${type} = '${id}' and level=2;`, (err, resp) => {
        resolve(resp[0].count);
      });
    });
    let l0r = new Promise((resolve, reject) => {
      db.con().query(`select count(*) as count from tickets where ${type} = '${id}' and createdAt = updatedAt and level=0;`, (err, resp) => {
        resolve(resp[0].count);
      });
    });
    let l1r = new Promise((resolve, reject) => {
      db.con().query(`select count(*) as count from tickets where ${type} = '${id}' and createdAt = updatedAt and level=1;`, (err, resp) => {
        resolve(resp[0].count);
      });
    });
    let l2r = new Promise((resolve, reject) => {
      db.con().query(`select count(*) as count from tickets where ${type} = '${id}' and createdAt = updatedAt and level=2;`, (err, resp) => {
        resolve(resp[0].count);
      });
    });
    Promise.all([st0, st1, l0, l1, l2, l0r, l1r, l2r])
    .then(values => {
      count.st0 = values[0];
      count.st1 = values[1];
      count.l0 = values[2];
      count.l1 = values[3];
      count.l2 = values[4];
      count.l0r = values[5];
      count.l1r = values[6];
      count.l2r = values[7];
      res.status(200).json({success: true, data:count});
    })
    .catch(error => {
      throw error;
    });
  });
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
