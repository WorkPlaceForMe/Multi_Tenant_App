const ws = require('ws')
const { v4: uuidv4 } = require('uuid')
const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

exports.sender = async function () {
  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImViZTU2YTQwLWZhYjgtNGJmZi05YzgwLTFhN2YwNGFkZDIzOSIsImlkX2FjY291bnQiOiJlYmU1NmE0MC1mYWI4LTRiZmYtOWM4MC0xYTdmMDRhZGQyMzkiLCJpZF9icmFuY2giOiJlYmU1NmE0MC1mYWI4LTRiZmYtOWM4MC0xYTdmMDRhZGQyMzkiLCJpYXQiOjE2NzUyNzE5MTUsImV4cCI6MTY3NTMxNTExNX0.bsTScnom20tj-sxUEXvwxUpCx0dYlpe2uTrVYtt8NBE'
  try {
    const connection = new ws('ws://localhost:3300/ws/connect/algorithm', token)
    let ts; let uuid; let message; let dwell = 10; let analytic; let parameters; let track_id = 1; let zone = 0

    setInterval(async () => {
      uuid = uuidv4()
      ts = Math.round((new Date()).getTime() / 1000)
      dwell = dwell + 5
      if (dwell % 2 == 0) {
        zone = 1
      } else {
        zone = 0
      }
      if (dwell === 80) dwell = 10
      track_id++
      parameters = {
        camera_name: 'test House',
        dwell: dwell,
        track_id: 1
      }
      analytic = 2
      message = {
        id: `${uuid}`,
        TimeStamp: ts,
        Analytic: `'${analytic}'`,
        CameraId: 'bffdb3cf-8cf3-4454-9474-3a47cf99ef10',
        Parameters: parameters,
        Detail: 'string',
        UrlImage: 'string'
      }
      connection.send(JSON.stringify(message))
      parameters = {
        camera_name: 'test House',
        zone: zone,
        track_id: track_id
      }
      analytic = 17
      await delay(1000)
      message = {
        id: `${uuid}`,
        TimeStamp: ts,
        Analytic: `'${analytic}'`,
        CameraId: 'bffdb3cf-8cf3-4454-9474-3a47cf99ef10',
        Parameters: parameters,
        Detail: 'string',
        UrlImage: 'string'
      }
      connection.send(JSON.stringify(message))
      parameters = {
        camera_name: 'test House',
        zone: 0,
        track_id: track_id
      }
      analytic = 16
      await delay(1000)
      message = {
        id: `${uuid}`,
        TimeStamp: ts,
        Analytic: `'${analytic}'`,
        CameraId: 'bffdb3cf-8cf3-4454-9474-3a47cf99ef10',
        Parameters: parameters,
        Detail: 'string',
        UrlImage: 'string'
      }
      connection.send(JSON.stringify(message))
    }, 5000)
  } catch (err) {
    console.error(err)
  }
}
