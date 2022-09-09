module.exports = (sequelize, Sequelize) => {
  const Reply = sequelize.define('helpdesk_reply', {
    id: {
      type: Sequelize.STRING,
      primaryKey: true
    },
    helpdesk_id: {
      type: Sequelize.STRING
    },
    user_id: {
      type: Sequelize.STRING
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
