require('dotenv').config({
  path: '../../config.env'
})
const fs = require('fs')
const { exec } = require('child_process')
const moment = require('moment')
const { getVideoDurationInSeconds } = require('get-video-duration')
const environment = require('../utils/environment')
const summarizationDBService = require('../services/summarization.db.service')
const cameraDBService = require('../services/camera.db.service')
const path = require('path')
const summarizationStatus = require('../utils/summarization.status')
const {
  v1: uuidv1
} = require('uuid')

exports.processVideo = async (req, res) => {
  let inputVideoFile = process.env.VIDEO_PATH + environment.DEFAULT_VIDEO_FILE_NAME
  const format = 'HH:mm:ss'
  const reqBody = req.body
  const defaultStartTime = '00:00:00'
  let difference = 0

  if (reqBody.inputFileName && reqBody.inputFileName.includes('\\')) {
    reqBody.inputFileName = reqBody.inputFileName.split('\\').join(path.posix.sep)
  }

  if (reqBody.inputFileName && reqBody.inputFileName.trim() !== '') {
    inputVideoFile = reqBody.inputFileName
  }

  try {
    if (!fs.existsSync(inputVideoFile)) {
      return res.status(400).json({
        success: false,
        error_code: 1,
        message: 'Video file not found',
        inputFilePath: inputVideoFile
      })
    } else {
      if (reqBody.duration && reqBody.duration < 3) {
        return res.status(400).json({
          success: false,
          message: 'Duration value must be atleast 3 minutes'
        })
      }

      reqBody.startTime = reqBody.startTime ? reqBody.startTime : defaultStartTime

      if (reqBody.startTime && reqBody.endTime) {
        difference = moment(reqBody.endTime, format).diff(moment(reqBody.startTime, format))
        if (difference <= 0) {
          return res.status(400).send({
            message: 'End time must be greater than start time'
          })
        }
      }

      const duration = await getVideoDurationInSeconds(inputVideoFile)
      if (duration <= 180) {
        return res.status(400).json({
          success: false,
          message: 'Input video must be longer than 3 minutes'
        })
      }

      if (duration < Math.floor(reqBody.duration * 60)) {
        return res.status(400).json({
          success: false,
          message: 'Duration specified is greater than actual video length'
        })
      }

      const diffWithDefaultStartTime = moment(reqBody.startTime, format).diff(moment(defaultStartTime, format))

      if (duration < diffWithDefaultStartTime / 1000) {
        return res.status(400).json({
          success: false,
          message: 'Start time is greater than actual video duration'
        })
      }

      if (duration < difference / 1000) {
        return res.status(400).json({
          success: false,
          message: 'End time greater than actual video duration'
        })
      }

      if (!reqBody.duration) {
        reqBody.duration = 3
      }

      if (!reqBody.endTime) {
        reqBody.endTime = moment.utc(moment.duration(duration, 'seconds').as('milliseconds')).format(format)
      }

      const data = await summarizationDBService.findProgressDataList(inputVideoFile, reqBody.clientId)

      if (data && data.length > 0 && data[0].progress_value !== summarizationStatus.ERROR) {
        return res.status(400).json({
          success: false,
          message: 'This video file already processed/processing'
        })
      } else {
        res.status(200).send({
          success: true,
          message: 'Video is under process, it will be ready soon.'
        })

        const id = uuidv1()
        const outputVideoFileExtension = inputVideoFile.split('.').pop()
        const outputVideoFile = inputVideoFile.substring(0, inputVideoFile.lastIndexOf('.')) +
      '-' + id + '.' + outputVideoFileExtension

        let cmd = `sh demo.sh -i ${inputVideoFile} -o ${outputVideoFile}`

        if (reqBody.startTime) {
          cmd = cmd + ' -s ' + reqBody.startTime
        }

        if (reqBody.endTime) {
          cmd = cmd + ' -e ' + reqBody.endTime
        }

        if (reqBody.duration) {
          cmd = cmd + ' -d ' + Math.floor(reqBody.duration * 60)
        }

        if (!reqBody.clientId) {
          reqBody.clientId = environment.DEFAULT_CLIENT_ID
        }

        console.log(`Client with clientId: ${reqBody.clientId} submitted this command for processing.... ${cmd}`)

        summarizationDBService
          .createProgressData(
            id,
            inputVideoFile,
            outputVideoFile,
            reqBody.videoId,
            reqBody.clientId,
            reqBody.startTime,
            reqBody.endTime,
            reqBody.duration,
            summarizationStatus.IN_PROGRESS
          )
          .then(progress => {
            if (progress) {
              console.log('Progress data created with id: ' + progress.id)
              cameraDBService.updateSummarizationStatus(reqBody.videoId, summarizationStatus.IN_PROGRESS).then()

              exec(
                cmd,
                {
                  cwd: `${environment.VIDEO_CONVERTER_PYTHON_SCRIPT_HOME_PATH}`
                },
                (err, stdout, stderr) => {
                  if (err || stderr) {
                    summarizationDBService
                      .updateProgressData(progress.id, summarizationStatus.ERROR)
                      .then(() => {
                        cameraDBService.updateSummarizationStatus(reqBody.videoId, summarizationStatus.ERROR).then()
                      })
                    console.log('======= Video Processing failed =======')
                    console.log(`error: ${err}`)
                    console.log(`stderr: ${stderr}`)
                  } else {
                    console.log('======= Video Processing succeeded =======')
                    summarizationDBService
                      .updateProgressData(progress.id, summarizationStatus.COMPLETED)
                      .then(() => {
                        cameraDBService.updateSummarizationStatus(reqBody.videoId, summarizationStatus.COMPLETED, summarizationStatus.COMPLETED).then()
                      }
                      )
                    console.log(`stdout: ${stdout}`)
                    console.log(`stderr: ${stderr}`)
                  }
                }
              )
            }
          })
      }
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error
    })
  }
}

exports.getOutputVideoStream = async (req, res) => {
  try {
    if (!req.query.clientId) {
      req.query.clientId = environment.DEFAULT_CLIENT_ID
    }

    if (req.query.inputFileName && req.query.inputFileName.includes('\\')) {
      req.query.inputFileName = req.query.inputFileName.split('\\').join('/')
    }

    summarizationDBService
      .findProgressData(
        req.query.inputFileName,
        req.query.clientId,
        req.query.startTime,
        req.query.endTime,
        req.query.duration,
        summarizationStatus.COMPLETED
      )
      .then(data => {
        if (data) {
          if (fs.existsSync(data.output_file_path)) {
            console.log(
              'Found Processed video found for the client with client id: ' +
                req.query.clientId +
                ' video path: ' +
                data.output_file_path
            )
            const videoSize = fs.statSync(data.output_file_path).size

            const range = req.headers.range

            if (!range) {
              res.writeHead(200, {
                'Content-Length': videoSize,
                'Content-Type': 'video/mp4'
              })

              fs.createReadStream(data.output_file_path).pipe(res)
            } else {
              const chunkSize = 10 ** 6
              const start = Number(range.replace(/\D/g, ''))
              const end = Math.min(start + chunkSize, videoSize - 1)
              const contentLength = end - start + 1

              const headers = {
                'Content-Range': `bytes ${start}-${end}/${videoSize}`,
                'Accept-Ranges': 'bytes',
                'Content-Length': contentLength,
                'Content-Type': 'video/mp4'
              }

              res.writeHead(206, headers)
              console.log('Output video file : ' + data.output_file_path)
              const videoStream = fs.createReadStream(data.output_file_path, { start, end })
              videoStream.pipe(res)
            }
          }
        } else {
          console.log(
            'Processed video not found for the client with client id: ' + req.query.clientId
          )
          res.status(500).json({
            success: false,
            message:
              'Processed video not found for the client with client id: ' + req.query.clientId
          })
        }
      })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error
    })
  }
}

exports.getVideoList = async (req, res) => {
  try {
    if (!req.query.clientId) {
      req.query.clientId = environment.DEFAULT_CLIENT_ID
    }

    if (req.query.inputFileName && req.query.inputFileName.includes('\\')) {
      req.query.inputFileName = req.query.inputFileName.split('\\').join(path.posix.sep)
    }

    summarizationDBService.findProgressDataList(req.query.inputFileName, req.query.clientId,
      req.query.startTime,
      req.query.endTime,
      req.query.duration).then(data => {
      if (data && data.length > 0) {
        res.status(200).json({
          success: true,
          message: `Video list found for the client with client id: ${req.query.clientId}`,
          data: data
        })
      } else {
        res.status(404).json({
          success: false,
          message: `Video list not found for the client with client id: ${req.query.clientId}`
        })
      }
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Video list not found for the client with client id: ${req.query.clientId}`
    })
  }
}
