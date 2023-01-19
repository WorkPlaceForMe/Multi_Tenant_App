require('dotenv').config({
  path: '../../../config.env'
})
const db = require('../models/dbmysql')
const stream = require('stream')
const xlsx = require('node-xlsx').default
const Excel = require('exceljs')
const async = require('async')

const createExelReport = async (data, name) => {
  const excelDataArray = []
  excelDataArray.push(Object.keys(data[0]))
  for (const obj of data) {
    excelDataArray.push(Object.values(obj))
  }
  const buffer = xlsx.build([{ name: 'report', data: excelDataArray }])

  return buffer
}

exports.report1 = async (req, res) => {
  const data = req.body
  let extra = ''
  if (req.params.algo_id === '22') {
    extra = " and severity = '2'"
  }
  // const diff = Math.ceil((new Date(data.end) - new Date(data.start)) / (1000 * 3600 * 24))
  let start, end
  // if (diff === 1) {
  start = new Date(data.start).getTime() + 7 * 60 * 60 * 1000
  start = JSON.stringify(new Date(start))
  start = start.substring(1, start.length - 1)
  end = new Date(data.end).getTime() - 1 * 60 * 60 * 1000
  end = JSON.stringify(new Date(end))
  end = end.substring(1, end.length - 1)
  // }
  // console.log(req.params.algo_id)
  let query = `SELECT id, time, camera_name, cam_id, zone, severity from queue_alerts WHERE ${data.type} = '${req.params.cam_id}' and time >= '${start}' and  time <= '${end}'${extra} order by time asc;`

  if (data.algo === 'count') {
    query = `SELECT id, start_time, end_time, camera_name, cam_id, qid, track_id, queuing from queue_mgt WHERE ${data.type} = '${req.params.cam_id}' and start_time >= '${start}' and  start_time <= '${end}' order by start_time asc;`
  }
  if (req.params.algo_id === '69' && data.typ === 'alerts') {
    query = `SELECT id, time, camera_name, cam_id, zone, severity from avail_alerts WHERE ${data.type} = '${req.params.cam_id}' and time >= '${start}' and  time <= '${end}' order by time asc;`
  }
  if (req.params.algo_id === '69' && data.typ === 'data') {
    query = `SELECT time, camera_name, cam_id, zone, availability from bread_availability WHERE ${data.type} = '${req.params.cam_id}' and time >= '${start}' and  time <= '${end}' order by time asc;`
  }
  if (req.params.algo_id === '70' && data.typ === 'alerts') {
    query = `SELECT id, time, camera_name, cam_id, zone, severity from temp_alerts WHERE ${data.type} = '${req.params.cam_id}' and time >= '${start}' and  time <= '${end}' order by time asc;`
  }
  if (req.params.algo_id === '70' && data.typ === 'data') {
    query = `SELECT time, camera_name, cam_id, zone, temperature from bread_temperature WHERE ${data.type} = '${req.params.cam_id}' and time >= '${start}' and  time <= '${end}' order by time asc;`
  }
  await db
    .con()
    .query(
      query,
      async function (_err, result) {
        if (result === undefined || result.length === 0) {
          return res.status(400).send({ success: false, message: 'No hay data.', type: data.typ })
        }
        const fn = `${req.params.cam_id}-${start}`
        const exc = await createExelReport(result, fn)
        const readStream = new stream.PassThrough()
        readStream.end(exc)
        res.set('Content-disposition', 'attachment; filename=' + fn)
        res.set('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')

        readStream.pipe(res)
      })
}

exports.report = async (req, res) => {
  const data = req.body
  let extra = ''
  if (req.params.algo_id === '22') {
    extra = " and severity = '2'"
  }
  // const diff = Math.ceil((new Date(data.end) - new Date(data.start)) / (1000 * 3600 * 24))
  let start, end
  // if (diff === 1) {
  start = new Date(data.start).getTime() + 7 * 60 * 60 * 1000
  start = JSON.stringify(new Date(start))
  start = start.substring(1, start.length - 1)
  end = new Date(data.end).getTime() - 1 * 60 * 60 * 1000
  end = JSON.stringify(new Date(end))
  end = end.substring(1, end.length - 1)
  // }
  // console.log(req.params.algo_id)
  let query = `SELECT id, time, camera_name, cam_id, zone, severity from queue_alerts WHERE ${data.type} = '${req.params.cam_id}' and time >= '${start}' and  time <= '${end}'${extra} order by time asc;`

  if (data.algo === 'count') {
    query = `SELECT id, start_time, end_time, camera_name, cam_id, qid, track_id, queuing from queue_mgt WHERE ${data.type} = '${req.params.cam_id}' and start_time >= '${start}' and  start_time <= '${end}' order by start_time asc;`
  }
  if (req.params.algo_id === '69' && data.typ === 'alerts') {
    query = `SELECT id, time, camera_name, cam_id, zone, severity from avail_alerts WHERE ${data.type} = '${req.params.cam_id}' and time >= '${start}' and  time <= '${end}' order by time asc;`
  }
  if (req.params.algo_id === '69' && data.typ === 'data') {
    query = `SELECT time, camera_name, cam_id, zone, availability from bread_availability WHERE ${data.type} = '${req.params.cam_id}' and time >= '${start}' and  time <= '${end}' order by time asc;`
  }
  if (req.params.algo_id === '70' && data.typ === 'alerts') {
    query = `SELECT id, time, camera_name, cam_id, zone, severity from temp_alerts WHERE ${data.type} = '${req.params.cam_id}' and time >= '${start}' and  time <= '${end}' order by time asc;`
  }
  if (req.params.algo_id === '70' && data.typ === 'data') {
    query = `SELECT time, camera_name, cam_id, zone, temperature from bread_temperature WHERE ${data.type} = '${req.params.cam_id}' and time >= '${start}' and  time <= '${end}' order by time asc;`
  }
  if (req.params.algo_id === '71') {
    query = `SELECT time, camera_name, cam_id, zone, receipt, trolley from scc WHERE ${data.type} = '${req.params.cam_id}' and time >= '${start}' and  time <= '${end}' order by time asc;`
  }
  await db
    .con()
    .query(
      query,
      async function (_err, result) {
        if (result === undefined || result.length === 0) {
          return res.status(400).send({ success: false, message: 'No hay data.', type: data.typ })
        }
        res.status(200).json({
          sucess: true,
          data: result
        })
      })
}
