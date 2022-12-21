module.exports = (sequelize, Sequelize) => {
  const Progress = sequelize.define('progress', {
    id: {
      type: Sequelize.STRING,
      primaryKey: true
    },
    video_id: {
      type: Sequelize.STRING
    },
    input_file_path: {
      type: Sequelize.STRING
    },
    start_time: {
      type: Sequelize.STRING
    },
    end_time: {
      type: Sequelize.STRING
    },
    duration: {
      type: Sequelize.INTEGER
    },
    output_file_path: {
      type: Sequelize.STRING
    },
    client_id: {
      type: Sequelize.STRING
    },
    progress_value: {
      type: Sequelize.INTEGER
    },
    createdAt: {
      type: Sequelize.DATE
    },
    updatedAt: {
      type: Sequelize.DATE
    }
  }, {
    freezeTableName: true
  })

  return Progress
}
