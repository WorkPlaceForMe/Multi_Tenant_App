require('dotenv').config({ path: '..././../config.env' })
const jwt = require('jsonwebtoken')
const db = require('../models/dbmysql')
const dateFormat = require('dateformat')

const count = {
  st0: 0, // st0 - Total Alerts remaining
  st1: 0, // st1 - Total Alerts solved
  l0: 0, // l0 - low level alerts
  l0r: 0, // l0r - low level alerts remaining
  l1: 0, // l1 - Medium level
  l1r: 0, // l1r - Medium rem
  l2: 0, // l2 - high level
  l2r: 0
}

exports.getAll = (req, res) => {
  const data = req.query
  const token = req.headers['x-access-token']
  const id = Array.isArray(data.id) ? data.id[data.id.length - 1] : data.id
  const type = Array.isArray(data.type) ? data.type[data.type.length - 1] : data.type
  const page = parseInt(data._page)
  const limit = parseInt(data._limit)
  const offset = (page - 1) * limit
  const _sort = Array.isArray(data._sort) ? data._sort[data._sort.length - 1] : data._sort
  const _order = Array.isArray(data._order) ? data._order[data._order.length - 1] : data._order

  jwt.verify(token, process.env.secret, async (err, decoded) => {
    const promise1 = new Promise((resolve, reject) => {
      db.con().query(`SELECT count(*) as count FROM tickets WHERE ${type} = '${id}';`, (err, resp) => {
        resolve(resp[0].count)
      })
    })
    const promise2 = new Promise((resolve, reject) => {
      db.con().query(`SELECT type, createdAt, updatedAt, assigned, level, reviewed, assignedBy, cam_name FROM tickets WHERE BINARY ${type} = '${id}' ORDER BY ${_sort} ${_order} LIMIT ${limit} OFFSET ${offset};`, (err, resp) => {
        resolve(resp)
      })
    })
    Promise.all([promise1, promise2])
      .then(values => {
        values[1].forEach(element => {
          element.createdAt = dateFormat(element.createdAt, 'yyyy-mm-dd HH:MM:ss')
          element.updatedAt = dateFormat(element.updatedAt, 'yyyy-mm-dd HH:MM:ss')
          if (element.createdAt === element.updatedAt) {
            element.updatedAt = ''
          }
          switch (element.type) {
            case 'loitering': {
              element.type = 'Person Loitering in restricted area'
              break
            }
            case 'intrude': {
              element.type = 'Person trespassing - tripwire'
              break
            }
            case 'aod': {
              element.type = 'Object left unattended'
              break
            }
            case 'fr': {
              element.type = 'Face detection'
              break
            }
            case 'crowd': {
              element.type = 'People converged or crowd gathering'
              break
            }
            case 'sceneChange': {
              element.type = 'Camera scene changed'
              break
            }
            case 'objectRemoval': {
              element.type = 'Object removed/ possible theft'
              break
            }
            case 'Veh_Entered': {
              element.type = 'Vehicle entere restricted area'
              break
            }
            case 'Entered': {
              element.type = 'Person entered restricted area'
              break
            }
            case 'fire': {
              element.type = 'Incipient fire / fire detection'
              break
            }
            case 'cameraBlinded': {
              element.type = 'Camera Blinded'
              break
            }
            case 'cameraDefocused': {
              element.type = 'Camera defocused/ blurred'
              break
            }
            case 'Exited': {
              element.type = 'Person exited restricted area'
              break
            }
            case 'Veh_Exited': {
              element.type = 'Vehicle exited restricted area'
              break
            }
            case 'velocity': {
              element.type = 'Speeding vehicle'
              break
            }
            case 'enterExit': {
              element.type = 'Person entered / exited restricted area'
              break
            }
            case 'queue_mgt': {
              element.type = 'Queue Management'
              break
            }
            case 'faces': {
              element.type = 'Face detection'
              break
            }
            case 'parking': {
              element.type = 'Parking Violation in Restricted Area'
              break
            }
            case 'congestion': {
              element.type = 'Vehicle Congestion'
              break
            }
            case 'anpr': {
              element.type = 'ANPR alert'
              break
            }
          }
        })
        res.status(200).json({ success: true, data: values[1], total: values[0] })
      })
      .catch(error => {
        throw error
      })
  })
}

const getAllTickets = async (row_count, type, id, data, res) => {
  const page = parseInt(data._page)
  const limit = parseInt(data._limit)
  const offset = (row_count === (page * limit)) ? (page - 1) * limit : (page - 1) * limit
  const _sort = Array.isArray(data._sort) ? data._sort[data._sort.length - 1] : data._sort
  const _order = Array.isArray(data._order) ? data._order[data._order.length - 1] : data._order
  await db.con().query(`SELECT type, createdAt, updatedAt, assigned, level, reviewed, assignedBy, cam_name FROM tickets WHERE BINARY ${type} = '${id}' ORDER BY ${_sort} ${_order} LIMIT ${limit} OFFSET ${offset};`, function (err, result) {
    if (err) return res.status(500).json({ success: false, message: err })
    result.forEach(element => {
      element.createdAt = dateFormat(element.createdAt, 'yyyy-mm-dd HH:MM:ss')
      element.updatedAt = dateFormat(element.updatedAt, 'yyyy-mm-dd HH:MM:ss')
      if (element.createdAt === element.updatedAt) {
        element.updatedAt = ''
      }
      switch (element.type) {
        case 'loitering': {
          element.type = 'Person Loitering in restricted area'
          break
        }
        case 'intrude': {
          element.type = 'Person trespassing - tripwire'
          break
        }
        case 'aod': {
          element.type = 'Object left unattended'
          break
        }
        case 'fr': {
          element.type = 'Face detection'
          break
        }
        case 'crowd': {
          element.type = 'People converged or crowd gathering'
          break
        }
        case 'sceneChange': {
          element.type = 'Camera scene changed'
          break
        }
        case 'objectRemoval': {
          element.type = 'Object removed/ possible theft'
          break
        }
        case 'Veh_Entered': {
          element.type = 'Vehicle entere restricted area'
          break
        }
        case 'Entered': {
          element.type = 'Person entered restricted area'
          break
        }
        case 'fire': {
          element.type = 'Incipient fire / fire detection'
          break
        }
        case 'cameraBlinded': {
          element.type = 'Camera Blinded'
          break
        }
        case 'cameraDefocused': {
          element.type = 'Camera defocused/ blurred'
          break
        }
        case 'Exited': {
          element.type = 'Person exited restricted area'
          break
        }
        case 'Veh_Exited': {
          element.type = 'Vehicle exited restricted area'
          break
        }
        case 'velocity': {
          element.type = 'Speeding vehicle'
          break
        }
        case 'enterExit': {
          element.type = 'Person entered / exited restricted area'
          break
        }
        case 'parking': {
          element.type = 'Vehicle parked in restricted area'
          break
        }
        case 'queue_mgt': {
          element.type = 'Queue Management'
          break
        }
        case 'faces': {
          element.type = 'Face detection'
          break
        }
      }
    })
    res.status(200).json({ success: true, data: result, total: row_count })
  })
}

exports.searchAllTickets = (req, res) => {
  const data = req.query
  const token = req.headers['x-access-token']
  const id = Array.isArray(data.id) ? data.id[data.id.length - 1] : data.id
  const type = Array.isArray(data.type) ? data.type[data.type.length - 1] : data.type
  let searchStr = Array.isArray(data.searchStr) ? data.searchStr[data.searchStr.length - 1] : data.searchStr
  const searchField = Array.isArray(data.searchField) ? data.searchField[data.searchField.length - 1] : data.searchField
  const page = parseInt(data._page)
  const limit = parseInt(data._limit)
  const offset = (page - 1) * limit
  const _sort = Array.isArray(data._sort) ? data._sort[data._sort.length - 1] : data._sort
  const _order = Array.isArray(data._order) ? data._order[data._order.length - 1] : data._order
  switch (searchStr) {
    case 'Person Loitering in restricted area': {
      searchStr = 'loitering'
      break
    }
    case 'Person trespassing - tripwire': {
      searchStr = 'intrude'
      break
    }
    case 'trespassing': {
      searchStr = 'intrude'
      break
    }
    case 'Object left unattended': {
      searchStr = 'aod'
      break
    }
    case 'Face detection': {
      searchStr = 'fr'
      break
    }
    case 'face': {
      searchStr = 'fr'
      break
    }
    case 'People converged or crowd gathering': {
      searchStr = 'crowd'
      break
    }
    case 'Camera scene changed': {
      searchStr = 'sceneChange'
      break
    }
    case 'Object removed/ possible theft': {
      searchStr = 'objectRemoval'
      break
    }
    case 'Vehicle entere restricted area': {
      searchStr = 'Veh_Entered'
      break
    }
    case 'Person entered restricted area': {
      searchStr = 'Entered'
      break
    }
    case 'Incipient fire / fire detection': {
      searchStr = 'fire'
      break
    }
    case 'Camera Blinded': {
      searchStr = 'cameraBlinded'
      break
    }
    case 'Camera defocused/ blurred': {
      searchStr = 'cameraDefocused'
      break
    }
    case 'Person exited restricted area': {
      searchStr = 'Exited'
      break
    }
    case 'Vehicle exited restricted area': {
      searchStr = 'Veh_Exited'
      break
    }
    case 'Speeding vehicle': {
      searchStr = 'velocity'
      break
    }
    case 'Person entered / exited restricted area': {
      searchStr = 'enterExit'
      break
    }
    case 'Vehicle parked in restricted area': {
      searchStr = 'parking'
      break
    }
    case 'Queue Management': {
      searchStr = 'queue_mgt'
      break
    }
    case 'Face detection': {
      searchStr = 'faces'
      break
    }
  }
  jwt.verify(token, process.env.secret, async (err, decoded) => {
    /* await db.con().query(`SELECT count(*) as count FROM tickets WHERE ${type} = '${id}' AND ${searchField} = '${searchStr}';`, function(err, resp) {
      search_total_row_count = resp[0].count;
      searchTickets(search_total_row_count, type, id, searchField, searchStr, data, res);
    }); */
    const promise1 = new Promise((resolve, reject) => {
      db.con().query(`SELECT count(*) as count FROM tickets WHERE ${type} = '${id}' AND ${searchField} = '${searchStr}';`, (err, resp) => {
        resolve(resp[0].count)
      })
    })
    const promise2 = new Promise((resolve, reject) => {
      db.con().query(`SELECT type, createdAt, updatedAt, assigned, level, reviewed, assignedBy, cam_name FROM tickets WHERE BINARY ${type} = '${id}' AND ${searchField} LIKE '%${searchStr}%' ORDER BY ${_sort} ${_order} LIMIT ${limit} OFFSET ${offset};`, (err, resp) => {
        resolve(resp)
      })
    })
    Promise.all([promise1, promise2])
      .then(values => {
        values[1].forEach(element => {
          element.createdAt = dateFormat(element.createdAt, 'yyyy-mm-dd HH:MM:ss')
          element.updatedAt = dateFormat(element.updatedAt, 'yyyy-mm-dd HH:MM:ss')
          if (element.createdAt === element.updatedAt) {
            element.updatedAt = ''
          }
          switch (element.type) {
            case 'loitering': {
              element.type = 'Person Loitering in restricted area'
              break
            }
            case 'intrude': {
              element.type = 'Person trespassing - tripwire'
              break
            }
            case 'aod': {
              element.type = 'Object left unattended'
              break
            }
            case 'fr': {
              element.type = 'Face detection'
              break
            }
            case 'crowd': {
              element.type = 'People converged or crowd gathering'
              break
            }
            case 'sceneChange': {
              element.type = 'Camera scene changed'
              break
            }
            case 'objectRemoval': {
              element.type = 'Object removed/ possible theft'
              break
            }
            case 'Veh_Entered': {
              element.type = 'Vehicle entere restricted area'
              break
            }
            case 'Entered': {
              element.type = 'Person entered restricted area'
              break
            }
            case 'fire': {
              element.type = 'Incipient fire / fire detection'
              break
            }
            case 'cameraBlinded': {
              element.type = 'Camera Blinded'
              break
            }
            case 'cameraDefocused': {
              element.type = 'Camera defocused/ blurred'
              break
            }
            case 'Exited': {
              element.type = 'Person exited restricted area'
              break
            }
            case 'Veh_Exited': {
              element.type = 'Vehicle exited restricted area'
              break
            }
            case 'velocity': {
              element.type = 'Speeding vehicle'
              break
            }
            case 'enterExit': {
              element.type = 'Person entered / exited restricted area'
              break
            }
            case 'parking': {
              element.type = 'Vehicle parked in restricted area'
              break
            }
          }
        })
        res.status(200).json({ success: true, data: values[1], total: values[0] })
      })
      .catch(error => {
        throw error
      })
  })
}

const searchTickets = async (row_count, type, id, searchField, searchStr, data, res) => {
  const page = parseInt(data._page)
  const limit = parseInt(data._limit)
  const offset = (row_count === (page * limit)) ? (page - 1) * limit : (page - 1) * limit
  const _sort = Array.isArray(data._sort) ? data._sort[data._sort.length - 1] : data._sort
  const _order = Array.isArray(data._order) ? data._order[data._order.length - 1] : data._order

  await db.con().query(`SELECT * FROM tickets WHERE BINARY ${type} = '${id}' AND ${searchField} = '${searchStr}' ORDER BY ${_sort} ${_order} LIMIT ${limit} OFFSET ${offset};`, function (err, result) {
    if (err) return res.status(500).json({ success: false, message: err })
    result.forEach(element => {
      element.createdAt = dateFormat(element.createdAt, 'yyyy-mm-dd HH:MM:ss')
      element.updatedAt = dateFormat(element.updatedAt, 'yyyy-mm-dd HH:MM:ss')
      if (element.createdAt === element.updatedAt) {
        element.updatedAt = ''
      }
      switch (element.type) {
        case 'loitering': {
          element.type = 'Person Loitering in restricted area'
          break
        }
        case 'intrude': {
          element.type = 'Person trespassing - tripwire'
          break
        }
        case 'aod': {
          element.type = 'Object left unattended'
          break
        }
        case 'fr': {
          element.type = 'Facial Recognition'
          break
        }
        case 'crowd': {
          element.type = 'People converged or crowd gathering'
          break
        }
        case 'sceneChange': {
          element.type = 'Camera scene changed'
          break
        }
        case 'objectRemoval': {
          element.type = 'Object removed/ possible theft'
          break
        }
        case 'Veh_Entered': {
          element.type = 'Vehicle entere restricted area'
          break
        }
        case 'Entered': {
          element.type = 'Person entered restricted area'
          break
        }
        case 'fire': {
          element.type = 'Incipient fire / fire detection'
          break
        }
        case 'cameraBlinded': {
          element.type = 'Camera Blinded'
          break
        }
        case 'cameraDefocused': {
          element.type = 'Camera defocused/ blurred'
          break
        }
        case 'Exited': {
          element.type = 'Person exited restricted area'
          break
        }
        case 'Veh_Exited': {
          element.type = 'Vehicle exited restricted area'
          break
        }
        case 'velocity': {
          element.type = 'Speeding vehicle'
          break
        }
        case 'enterExit': {
          element.type = 'Person entered / exited restricted area'
          break
        }
        case 'parking': {
          element.type = 'Vehicle parked in restricted area'
          break
        }
      }
    })
    res.status(200).json({ success: true, data: result, total: row_count })
  })
}

exports.alertsOverview = async (req, res) => {
  const data = req.query
  const token = req.headers['x-access-token']
  const id = Array.isArray(data.id) ? data.id[data.id.length - 1] : data.id
  const type = Array.isArray(data.type) ? data.type[data.type.length - 1] : data.type
  jwt.verify(token, process.env.secret, async (err, decoded) => {
    const st0 = new Promise((resolve, reject) => {
      db.con().query(`select count(*) as count from tickets where ${type} = '${id}' and createdAt = updatedAt;`, (err, resp) => {
        resolve(resp[0].count)
      })
    })
    const st1 = new Promise((resolve, reject) => {
      db.con().query(`select count(*) as count from tickets where ${type} = '${id}' and createdAt != updatedAt;`, (err, resp) => {
        resolve(resp[0].count)
      })
    })
    const l0 = new Promise((resolve, reject) => {
      db.con().query(`select count(*) as count from tickets where ${type} = '${id}' and level=0;`, (err, resp) => {
        resolve(resp[0].count)
      })
    })
    const l1 = new Promise((resolve, reject) => {
      db.con().query(`select count(*) as count from tickets where ${type} = '${id}' and level=1;`, (err, resp) => {
        resolve(resp[0].count)
      })
    })
    const l2 = new Promise((resolve, reject) => {
      db.con().query(`select count(*) as count from tickets where ${type} = '${id}' and level=2;`, (err, resp) => {
        resolve(resp[0].count)
      })
    })
    const l0r = new Promise((resolve, reject) => {
      db.con().query(`select count(*) as count from tickets where ${type} = '${id}' and createdAt = updatedAt and level=0;`, (err, resp) => {
        resolve(resp[0].count)
      })
    })
    const l1r = new Promise((resolve, reject) => {
      db.con().query(`select count(*) as count from tickets where ${type} = '${id}' and createdAt = updatedAt and level=1;`, (err, resp) => {
        resolve(resp[0].count)
      })
    })
    const l2r = new Promise((resolve, reject) => {
      db.con().query(`select count(*) as count from tickets where ${type} = '${id}' and createdAt = updatedAt and level=2;`, (err, resp) => {
        resolve(resp[0].count)
      })
    })
    Promise.all([st0, st1, l0, l1, l2, l0r, l1r, l2r])
      .then(values => {
        count.st0 = values[0]
        count.st1 = values[1]
        count.l0 = values[2]
        count.l1 = values[3]
        count.l2 = values[4]
        count.l0r = values[5]
        count.l1r = values[6]
        count.l2r = values[7]
        res.status(200).json({ success: true, data: count })
      })
      .catch(error => {
        throw error
      })
  })
}

exports.countTypes = async (req, res) => {
  const data = req.body
  await db.con().query(`SELECT type, count(type) as count FROM multi_tenant.tickets WHERE createdAt >= '${data.start}' and  createdAt <= '${data.end}' group by type;`, function (err, result) {
    if (err) return res.status(500).json({ success: false, message: err })
    const response = {
      count: result
    }
    res.status(200).json({ success: true, data: response })
  })
}

exports.getPeriod = async (req, res) => {
  const data = req.body
  await db.con().query(`SELECT * FROM tickets WHERE createdAt >= '${data.start}' and  createdAt <= '${data.end}' order by createdAt desc;`, function (err, result) {
    if (err) return res.status(500).json({ success: false, message: err })

    const response = {
      raw: result
    }
    res.status(200).json({ success: true, data: response })
  })
}

exports.check = (req, res) => {
  const d = new Date()
  const data = req.body
  let date = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds()
  if (data.user == null) {
    date = data.date
    date = new Date(date)
    date = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds()
  }
  db.con().query(`UPDATE tickets set updatedAt = '${date}', reviewed = '${data.user}' where id = '${req.params.id}';`, function (err, result) {
    if (err) return res.status(500).json({ success: false, message: err })
    res.status(200).json({ success: true, data: result })
  })
}

exports.assign = (req, res) => {
  const data = req.body
  db.con().query(`UPDATE tickets set assigned= '${data.assigned}', assignedBy= '${data.assignedBy}' where id = '${req.params.id}';`, function (err, result) {
    if (err) return res.status(500).json({ success: false, message: err })
    res.status(200).json({ success: true, data: result })
  })
}
