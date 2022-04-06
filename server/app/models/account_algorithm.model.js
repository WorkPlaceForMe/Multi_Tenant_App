module.exports = (sequelize, Sequelize) => {
  const AA = sequelize.define('account_algorithm', {
    algoId: {
      type: Sequelize.INTEGER
    },
    accountId: {
      type: Sequelize.STRING
    }
  })

  return AA
}
