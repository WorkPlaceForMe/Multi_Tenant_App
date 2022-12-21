module.exports = (sequelize, Sequelize) => {
  const Alert = sequelize.define('alerts', {
    id: {
      type: Sequelize.STRING,
      primaryKey: true
    },
    time: {
      type: Sequelize.DATE
    },
    cam_name: {
      type: Sequelize.STRING
    },
    cam_id: {
      type: Sequelize.STRING
    },
    trackid: {
      type: Sequelize.INTEGER
    },
    alert_type: {
      type: Sequelize.INTEGER
    },
    id_account: {
      type: Sequelize.STRING
    }
  }, {
    freezeTableName: true
  })

  return Alert
}
