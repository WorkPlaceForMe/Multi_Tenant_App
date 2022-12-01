const db = require('../models')

exports.updateSummarizationStatus = async (videoId, summarizationStatus, summarizationVideoStatus, outputVideoStream) => {
  const updateQuery = {}

  if (summarizationStatus || summarizationStatus === 0) {
    updateQuery.last_summarization_status = summarizationStatus
  }

  if (summarizationVideoStatus || summarizationVideoStatus === 0) {
    updateQuery.any_successful_summarization = summarizationVideoStatus
  }

  if (outputVideoStream) {
    updateQuery.sum_http_in = outputVideoStream
  }

  return db.camera.update(
    updateQuery,
    { where: { id: videoId } }
  )
}

exports.findCameraData = async (
  videoId
) => {
  return db.camera.findOne({
    where: { id: videoId }
  })
}
