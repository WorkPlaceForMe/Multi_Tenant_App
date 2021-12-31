require('dotenv').config({path: '../../config.env'})
const Sequelize = require('sequelize')
const sequelize = new Sequelize(process.env.DB, process.env.USERM, process.env.PASSWORD, {
  host: process.env.HOST,
  dialect: process.env.DIALECT,
  operatorsAliases: 0,
  logging: false

  // pool: {
  //   max: config.pool.max,
  //   min: config.pool.min,
  //   acquire: config.pool.acquire,
  //   idle: config.pool.idle
  // }
})

const db = {}

db.Sequelize = Sequelize
db.sequelize = sequelize

db.user = require('../models/user.model.js')(sequelize, Sequelize)
db.camera = require('../models/camera.model.js')(sequelize, Sequelize)
db.algorithm = require('../models/algorithm.model.js')(sequelize, Sequelize)
db.relation = require('../models/relation.model.js')(sequelize, Sequelize)
db.schedule = require('../models/schedule.model.js')(sequelize, Sequelize)
db.helpdesk = require('../models/helpdesk.model.js')(sequelize, Sequelize)

db.algorithm.belongsToMany(db.user, {
  through: 'account_algorithm',
  foreignKey: 'algoId',
  otherKey: 'accountId'
})
db.user.belongsToMany(db.algorithm, {
  through: 'account_algorithm',
  foreignKey: 'accountId',
  otherKey: 'algoId'
})

db.ALGORITHMS = [
  'Facial Recognition',
  'Person Climbing Barricade',
  'Loitering Detection',
  'D&C of human, animal and vehicle',
  'Parking Violation',
  'Speeding Vehicle',
  'Helmet detection on two-wheeler',
  'Banned vehicle detection',
  'Wrong way or illegal turn detection',
  'Graffiti & Vandalism detection',
  'Debris & Garbage detection',
  'Garbage bin, cleanned or not',
  'People Count',
  'ANPR',
  'Heatmap',
  'Demographics',
  'Abandoned Object',
  'Intrusion Alert',
  'Attendance Management',
  'Violence',
  'No Mask',
  'Social Distancing',
  'Queue Management',
  'Helmet Detection',
  'Vault Open',
  'Barrier Not Closed',
  'Vehicle Counting',
  'Camera Tampering',
  'Animals On Road',
  'Animal Detection',
  'Accident Detection',
  'Axle Detection',
  'Axle Count',
  'Car make Classification',
  'Carmake',
  'Clothing',
  'Vehicle Count at Screen',
  'Car Brand',
  'Weapon',
  'Bottle',
  'People Path',
  'Person Collapsing',
  'Fire Detection'
]

module.exports = db
