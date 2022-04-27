module.exports = (sequelize, Sequelize) => {
  const Ticket = sequelize.define('tickets', {
    id: {
      type: Sequelize.STRING,
      primaryKey: true
    },
    type: {
      type: Sequelize.STRING
    },
    createdAt: {
      type: Sequelize.DATE
    },
    updatedAt: {
      type: Sequelize.DATE
    },
    assigned: {
      type: Sequelize.STRING
    },
    id_account: {
      type: Sequelize.STRING
    },
    id_branch: {
      type: Sequelize.STRING
    },
    level: {
      type: Sequelize.INTEGER
    },
    reviewed: {
      type: Sequelize.STRING
    },
    assignedBy: {
      type: Sequelize.STRING
    }
  }, {
    freezeTableName: true
  })

  return Ticket
}
