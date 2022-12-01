const db = require('../helpers/dbmysql')

exports.retrieve = async (req, res) => {
    const data = req.body
    await db
    .con()
    .query(
      `SELECT * from ${data.table} LIMIT 1000`,
      function (err, result) {
        if (err)
        return res.status(500).json({
          success: false,
          message: err
        })
        const a = {
            results: result,
          }
          res.status(200).json({
            success: true,
            data: a
          })
      }
    )
}

exports.update = async (req, res) => {
  const data = req.body
  await db
  .con()
  .query(
    `UPDATE ${data.table} SET ${data.updtField} = '${data.updtValue}' WHERE (${data.key} = '${data.value}')`,
    function (err, result) {
      if (err)
      return res.status(500).json({
        success: false,
        message: err
      })
      const a = {
          results: result,
        }
        res.status(200).json({
          success: true,
          data: a
        })
    }
  )
}

exports.insert = async (req, res) => {
  const data = req.body
  await db
  .con()
  .query(
    `INSERT INTO ${data.table} VALUES (${data.values});`,
    function (err, result) {
      if (err)
      return res.status(500).json({
        success: false,
        message: err
      })
      const a = {
          results: result,
        }
        res.status(200).json({
          success: true,
          data: a
        })
    }
  )
}