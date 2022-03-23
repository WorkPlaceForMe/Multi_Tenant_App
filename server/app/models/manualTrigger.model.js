module.exports = (sequelize, Sequelize) => {
  const ManualTrigger = sequelize.define('manual_trigger', {
    id: {
      type: Sequelize.STRING,
      primaryKey: true
    },
    user_id: {
      type: Sequelize.STRING
    },
    algo_id: {
      type: Sequelize.INTEGER
    },
    actions: {
      type: Sequelize.TEXT
    },
    severity: {
      type: Sequelize.STRING
    },
    camera_id: {
      type: Sequelize.STRING
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
    },
    triggered: {
      type: Sequelize.ENUM,
      allowNull: false,
      values: ['YES', 'NO'],
      defaultValue: 'NO'
    }
  })

  return ManualTrigger
}
