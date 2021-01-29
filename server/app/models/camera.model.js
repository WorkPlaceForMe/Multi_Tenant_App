module.exports = (sequelize, Sequelize) => {
    const Camera = sequelize.define("cameras", {
      id: {
        type: Sequelize.STRING,
        primaryKey: true
      },
      name: {
        type: Sequelize.STRING
      },
      rtsp_in: {
        type: Sequelize.STRING
      },
      heatmap_pic:{
        type: Sequelize.STRING
      },
      id_account:{
        type: Sequelize.STRING
      },
      id_branch:{
        type: Sequelize.STRING
      },
      pic_height:{
        type: Sequelize.INTEGER
      },
      pic_width:{
        type: Sequelize.INTEGER
      },
      cam_height:{
        type: Sequelize.INTEGER
      },
      cam_width:{
        type: Sequelize.INTEGER
      },
      stored_vid: {
        type: Sequelize.STRING
      },
    });
  
    return Camera;
  };