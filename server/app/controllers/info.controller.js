const fs = require('fs').promises

exports.info = async (req, res) => {
  try {
    const data = await fs.readFile('package.json', 'binary')
    const ver = JSON.parse(data).author
    res.status(200).json({ success: true, data: ver })
  } catch (err) {
    res.status(500).json({ success: false, error: err })
  }
}
