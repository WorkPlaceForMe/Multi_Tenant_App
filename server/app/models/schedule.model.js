module.exports = (sequelize, Sequelize) => {
  const Schedule = sequelize.define('schedule', {
    user_id: {
      type: Sequelize.STRING
    },
    day: {
      type: Sequelize.INTEGER
    },
    entrance: {
      type: Sequelize.STRING
    },
    leave_time: {
      type: Sequelize.STRING
    },
    id_account: {
      type: Sequelize.STRING
    },
    id_branch: {
      type: Sequelize.STRING
    }
  })

  return Schedule
}
