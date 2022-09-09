const fs = require('fs').promises;
const axios = require('axios')

exports.info = async (req, res) => {
    try{
        const data = await fs.readFile("package.json", 'binary');
        const ver = JSON.parse(data)
        delete ver.scripts
        delete ver.dependencies
        delete ver.devDependencies
        delete ver.main
        res.status(200).json({success: true, data: ver})
    }catch(err){
        res.status(500).json({success: false, error: err})
    }
}

exports.infoMain = async (req, res) => {
    const endpoint = `http://localhost:3300/api/serve/inf`
    try {
        const response = await axios.get(endpoint)
        res.status(200).json({ success: true, mess: response.data.data})
      } catch (err) {
        res.status(500).json({success: false, error: err.code})
      }
}