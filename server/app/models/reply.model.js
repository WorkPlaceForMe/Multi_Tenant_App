const db = require('.')
const UserModel = db.user
const HelpDeskModel = db.helpdesk

module.exports = (sequelize, Sequelize) => {
  const Reply = sequelize.define('helpdesk_reply', {
    id: {
      type: Sequelize.STRING,
      primaryKey: true
    },
    helpdesk_id: {
      type: Sequelize.STRING,
      references: {model: HelpDeskModel, key: 'id'},
      allowNull: false
    },
    user_id: {
      type: Sequelize.STRING,
      references: {model: UserModel, key: 'id'},
      allowNull: false
    },
    reply_message: {
      type: Sequelize.TEXT,
      allowNull: false
    },
    image_path: {
      type: Sequelize.STRING
    },
    http_in: {
      type: Sequelize.STRING
    }
  })

  return Reply
}
