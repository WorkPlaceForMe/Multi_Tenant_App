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
  await db
    .con()
    .query(
            `SELECT id, time, camera_name, cam_id, zone, severity from queue_alerts WHERE ${data.type} = '${req.params.cam_id}' and time >= '${data.start}' and  time <= '${data.end}'${extra} order by time asc;`,
            async function (err, result) {
              const fn = `${req.params.cam_id}-${data.start}`
              const exc = await createExelReport(result, fn)
              const readStream = new stream.PassThrough()
              readStream.end(exc)
              res.set('Content-disposition', 'attachment; filename=' + fn)
              res.set('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')

              readStream.pipe(res)
            })
}
