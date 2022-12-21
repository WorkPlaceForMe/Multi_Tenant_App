const db = require('../models')

exports.createProgressData = async (
  id,
  inputFilePath,
  outputFilePath,
  videoId,
  clientId,
  startTime,
  endTime,
  duration,
  progressValue
) => {
  return db.progress.create({
    id: id,
    input_file_path: inputFilePath,
    start_time: startTime,
    video_id: videoId,
    end_time: endTime,
    duration: duration,
    output_file_path: outputFilePath,
    client_id: clientId,
    progress_value: progressValue
  })
}

exports.updateProgressData = async (progressId, progressValue) => {
  return db.progress.update(
    { progress_value: progressValue },
    { where: { id: progressId } }
  )
}

exports.findProgressData = async (
  inputFilePath,
  clientId,
  startTime,
  endTime,
  duration,
  progressValue
) => {
  const query = {}

  if (inputFilePath) {
    query.input_file_path = inputFilePath
  }

  if (clientId) {
    query.client_id = clientId
  }

  if (startTime) {
    query.start_time = startTime
  }

  if (endTime) {
    query.end_time = endTime
  }

  if (duration) {
    query.duration = duration
  }

  if (progressValue) {
    query.progress_value = progressValue
  }

  return db.progress.findOne({
    where: query,
    order: [['createdAt', 'DESC']]
  })
}

exports.findProgressDataList = async (inputFilePath, clientId, startTime, endTime, duration) => {
  const query = {}

  if (inputFilePath) {
    query.input_file_path = inputFilePath
  }

  if (clientId) {
    query.client_id = clientId
  }

  if (startTime) {
    query.start_time = startTime
  }

  if (endTime) {
    query.end_time = endTime
  }

  if (duration) {
    query.duration = duration
  }

  return db.progress.findAll({
    where: query,
    order: [['createdAt', 'DESC']]
  })
}
