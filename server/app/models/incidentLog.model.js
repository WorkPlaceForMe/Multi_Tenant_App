module.exports = (sequelize, Sequelize) => {
  const IncidentLog = sequelize.define('incident_log', {
    id: {
      type: Sequelize.STRING,
      primaryKey: true
    },
    incident_id: {
      type: Sequelize.STRING,
      allowNull: false
    },
    user_id: {
      type: Sequelize.STRING
    },
    status: {
      type: Sequelize.ENUM,
      allowNull: false,
      values: ['CREATED', 'UPDATED', 'WARNING', 'ERROR'],
      defaultValue: 'CREATED'
    },
    logType: {
      type: Sequelize.ENUM,
      allowNull: false,
      values: ['MEMO', 'BOOKMARK']
    }
  })

  return IncidentLog
}
