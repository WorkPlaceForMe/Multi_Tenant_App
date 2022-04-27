const db = require('../models')

exports.updateSummarizationStatus = async (videoId, summarizationStatus, summarizationVideoStatus) => {
  const updateQuery = {}

  if (summarizationStatus || summarizationStatus === 0) {
    updateQuery.last_summarization_status = summarizationStatus
  }

  if (summarizationVideoStatus || summarizationVideoStatus === 0) {
    updateQuery.any_successful_summarization = summarizationVideoStatus
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
