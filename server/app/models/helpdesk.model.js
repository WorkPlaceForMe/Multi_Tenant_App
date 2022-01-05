const db = require('.')
const UserModel = db.user

module.exports = (sequelize, Sequelize) => {
  const HelpDesk = sequelize.define('helpdesk', {
    id: {
      type: Sequelize.STRING,
      primaryKey: true
    },
    user_id: {
      type: Sequelize.STRING,
      references: {model: UserModel, key: 'id'},
      allowNull: false
    },
    title: {
      type: Sequelize.STRING,
      allowNull: false
    },
    message: {
      type: Sequelize.TEXT,
      allowNull: false
    },
    user_type: {
      type: Sequelize.STRING,
      allowNull: false
    },
    client_id: {
      type: Sequelize.STRING,
      references: {model: UserModel, key: 'id'},
      allowNull: false
    },
    image_path: {
      type: Sequelize.STRING
    },
    http_in: {
      type: Sequelize.STRING
    },
    status: {
      type: Sequelize.ENUM,
      allowNull: false,
      values: ['PENDING', 'PROCESSING', 'RESOLVED', 'REOPENED'],
      defaultValue: 'PENDING'
    }
  })

  return HelpDesk
}
