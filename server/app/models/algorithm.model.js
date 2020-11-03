module.exports = (sequelize, Sequelize) => {
    const Algorithm = sequelize.define("algorithms", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true
      },
      name: {
        type: Sequelize.STRING
      }
    });
  
    return Algorithm;
  };