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
      references: {model: UserModel, key: 'id'}
    },
    title: {
      type: Sequelize.STRING
    },
    message: {
      type: Sequelize.TEXT
    },
    user_type: {
      type: Sequelize.STRING
    },
    client_id: {
      type: Sequelize.STRING,
      references: {model: UserModel, key: 'id'}
    },
    image_path: {
      type: Sequelize.STRING
    },
    http_in: {
      type: Sequelize.STRING
    }
  })

  // const syncOption = {
  //   alter: true
  // }

  // HelpDesk.sync(syncOption).then(() => {
  //   console.log('Helpdesk table created')
  // })

  // console.log('abc')

  return HelpDesk
}
