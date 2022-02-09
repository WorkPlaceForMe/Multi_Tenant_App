const db = require('.')
const UserModel = db.user
const CameraModel = db.camera

module.exports = (sequelize, Sequelize) => {
  const ManualTrigger = sequelize.define('manual_trigger', {
    id: {
      type: Sequelize.STRING,
      primaryKey: true
    },
    user_id: {
      type: Sequelize.STRING,
      references: UserModel,
      refereceKey: 'id',
      allowNull: false
    },
    actions: {
      type: Sequelize.TEXT
    },
    severity: {
      type: Sequelize.STRING
    },
    camera_id: {
      type: Sequelize.STRING,
      references: CameraModel,
      refereceKey: 'id',
      allowNull: false
    },
    http_in: {
      type: Sequelize.STRING
    },
    results: {
      type: Sequelize.TEXT
    },
    canvasWidth: {
      type: Sequelize.STRING
    },
    canvasHeight: {
      type: Sequelize.STRING
    }
  })

  // ManualTrigger.sync({force: true})
  //   .then(result => {
  //     console.log(result, 'table created')
  //   })
  //   .catch(err => {
  //     console.log(err)
  //   })

  return ManualTrigger
}
