require('dotenv').config({
  path: '../../../config.env'
})
const db = require('../models/dbmysql')
const stream = require('stream')
const xlsx = require('node-xlsx').default

const createExelReport = (data, name) => {
  const excelDataArray = []
  excelDataArray.push(Object.keys(data[0]))
  for (const obj of data) {
    excelDataArray.push(Object.values(obj))
  }
  const buffer = xlsx.build([{ name: 'report', data: excelDataArray }])

  return buffer
}

exports.report = async (req, res) => {
  const data = req.body
  let extra = ''
  if (req.params.algo_id === '22') {
    extra = " and severity = '2'"
  }
  let query = `SELECT id, time, camera_name, cam_id, zone, severity from queue_alerts WHERE ${data.type} = '${req.params.cam_id}' and time >= '${data.start}' and  time <= '${data.end}'${extra} order by time asc;`

  if (data.algo === 'count') {
    query = `SELECT id, start_time, end_time, camera_name, cam_id, qid, track_id, queuing from queue_mgt WHERE ${data.type} = '${req.params.cam_id}' and start_time >= '${data.start}' and  start_time <= '${data.end}' order by start_time asc;`
  }
  await db
    .con()
    .query(
      query,
      async function (_err, result) {
        const fn = `${req.params.cam_id}-${data.start}`
        const exc = await createExelReport(result, fn)
        const readStream = new stream.PassThrough()
        readStream.end(exc)
        res.set('Content-disposition', 'attachment; filename=' + fn)
        res.set('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')

        readStream.pipe(res)
      })
}
