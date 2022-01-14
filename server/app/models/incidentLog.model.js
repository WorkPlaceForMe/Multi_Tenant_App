const db = require('.')
const UserModel = db.user

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
      type: Sequelize.STRING,
      references: UserModel,
      refereceKey: 'id',
      allowNull: false
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
