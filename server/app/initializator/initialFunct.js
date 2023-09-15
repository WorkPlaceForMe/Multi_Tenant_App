const db = require('../models')
const usr = db.user
const algo = db.algorithm
const aa = db.aa
const bcrypt = require('bcryptjs')
const fs = require('fs')

exports.initial = async function () {
  const path =
  process.env.resources
  try{
    await usr.create({
      id: '0000-11111-aaaaaa-bbbbbb',
      username: 'admin',
      password: bcrypt.hashSync('gr@ymaticsAdmin312', 12),
      email: 'test@graymatics.com',
      role: 'admin',
      id_account: '0000',
      id_branch: '0000',
      disabled: 0
    })
  } catch (err) {
    if (err.name !== 'SequelizeUniqueConstraintError') console.error(err.name)
  }
  // await usr.create({
  //   id: '0000-11111-aaaaaa-bbbbbb',
  //   username: 'admin',
  //   password: bcrypt.hashSync('gr@ymaticsAdmin312', 12),
  //   email: 'test@graymatics.com',
  //   role: 'admin',
  //   id_account: '0000',
  //   id_branch: '0000',
  //   disabled: 0
  // })
  try{
    await algo.create({
      id: 0,
      name: 'Facial Recognition'
    })
  } catch (err) {
    if (err.name !== 'SequelizeUniqueConstraintError') console.error(err.name)
  }
  // await algo.create({
  //   id: 0,
  //   name: 'Facial Recognition'
  // })
  try{
    await algo.create({
      id: 1,
      name: 'Person Climbing Barricade'
    })
  } catch (err) {
    if (err.name !== 'SequelizeUniqueConstraintError') console.error(err.name)
  }
  // await algo.create({
  //   id: 1,
  //   name: 'Person Climbing Barricade'
  // })
  try{
    await algo.create({
      id: 2,
      name: 'Loitering Detection'
    })
  } catch (err) {
    if (err.name !== 'SequelizeUniqueConstraintError') console.error(err.name)
  }
  // await algo.create({
  //   id: 2,
  //   name: 'Loitering Detection'
  // })
  try{
    await algo.create({
      id: 3,
      name: 'D&C of human, animal and vehicle'
    })
  } catch (err) {
    if (err.name !== 'SequelizeUniqueConstraintError') console.error(err.name)
  }
  // await algo.create({
  //   id: 3,
  //   name: 'D&C of human, animal and vehicle'
  // })
  try{
    await algo.create({
      id: 4,
      name: 'Parking Violation'
    })
  } catch (err) {
    if (err.name !== 'SequelizeUniqueConstraintError') console.error(err.name)
  }
  // await algo.create({
  //   id: 4,
  //   name: 'Parking Violation'
  // })
  try{
    await algo.create({
      id: 5,
      name: 'Speeding Vehicle'
    })
  } catch (err) {
    if (err.name !== 'SequelizeUniqueConstraintError') console.error(err.name)
  }
  // await algo.create({
  //   id: 5,
  //   name: 'Speeding Vehicle'
  // })
  try{
    await algo.create({
      id: 6,
      name: 'Helmet detection on two-wheeler'
    })
  } catch (err) {
    if (err.name !== 'SequelizeUniqueConstraintError') console.error(err.name)
  }
  // await algo.create({
  //   id: 6,
  //   name: 'Helmet detection on two-wheeler'
  // })
  try{
    await algo.create({
      id: 7,
      name: 'Banned vehicle detection'
    })
  } catch (err) {
    if (err.name !== 'SequelizeUniqueConstraintError') console.error(err.name)
  }
  // await algo.create({
  //   id: 7,
  //   name: 'Banned vehicle detection'
  // })
  try{
    await algo.create({
      id: 8,
      name: 'Wrong way or illegal turn detection'
    })
  } catch (err) {
    if (err.name !== 'SequelizeUniqueConstraintError') console.error(err.name)
  }
  // await algo.create({
  //   id: 8,
  //   name: 'Wrong way or illegal turn detection'
  // })
  try{
    await algo.create({
      id: 9,
      name: 'Graffiti & Vandalism detection'
    })
  } catch (err) {
    if (err.name !== 'SequelizeUniqueConstraintError') console.error(err.name)
  }
  // await algo.create({
  //   id: 9,
  //   name: 'Graffiti & Vandalism detection'
  // })
  try{
    await algo.create({
      id: 10,
      name: 'Debris & Garbage detection'
    })
  } catch (err) {
    if (err.name !== 'SequelizeUniqueConstraintError') console.error(err.name)
  }
  
  // await algo.create({
  //   id: 10,
  //   name: 'Debris & Garbage detection'
  // })
  try{
    await algo.create({
      id: 11,
      name: 'Garbage bin, cleanned or not'
    })
  } catch (err) {
    if (err.name !== 'SequelizeUniqueConstraintError') console.error(err.name)
  }
  // await algo.create({
  //   id: 11,
  //   name: 'Garbage bin, cleanned or not'
  // })
  try{
    await algo.create({
      id: 12,
      name: 'People Count'
    })
  } catch (err) {
    if (err.name !== 'SequelizeUniqueConstraintError') console.error(err.name)
  }
  // await algo.create({
  //   id: 12,
  //   name: 'People Count'
  // })
  try{
    await algo.create({
      id: 13,
      name: 'ANPR'
    })
  } catch (err) {
    if (err.name !== 'SequelizeUniqueConstraintError') console.error(err.name)
  }
  // await algo.create({
  //   id: 13,
  //   name: 'ANPR'
  // })
  try{
    await algo.create({
      id: 14,
      name: 'Heatmap'
    })
  } catch (err) {
    if (err.name !== 'SequelizeUniqueConstraintError') console.error(err.name)
  }
  // await algo.create({
  //   id: 14,
  //   name: 'Heatmap'
  // })
  try{
    await algo.create({
      id: 15,
      name: 'Demographics'
    })
  } catch (err) {
    if (err.name !== 'SequelizeUniqueConstraintError') console.error(err.name)
  }
  // await algo.create({
  //   id: 15,
  //   name: 'Demographics'
  // })
  try{
    await algo.create({
      id: 16,
      name: 'Abandoned Object'
    })
  } catch (err) {
    if (err.name !== 'SequelizeUniqueConstraintError') console.error(err.name)
  }
  // await algo.create({
  //   id: 16,
  //   name: 'Abandoned Object'
  // })
  try{
    await algo.create({
      id: 17,
      name: 'Intrusion Alert'
    })
  } catch (err) {
    if (err.name !== 'SequelizeUniqueConstraintError') console.error(err.name)
  }
  // await algo.create({
  //   id: 17,
  //   name: 'Intrusion Alert'
  // })
  try{
    await algo.create({
      id: 18,
      name: 'Attendance Management'
    })
  } catch (err) {
    if (err.name !== 'SequelizeUniqueConstraintError') console.error(err.name)
  }
  // await algo.create({
  //   id: 18,
  //   name: 'Attendance Management'
  // })
  try{
    await algo.create({
      id: 19,
      name: 'Violence'
    })
  } catch (err) {
    if (err.name !== 'SequelizeUniqueConstraintError') console.error(err.name)
  }
  // await algo.create({
  //   id: 19,
  //   name: 'Violence'
  // })
  try{
    await algo.create({
      id: 20,
      name: 'No Mask'
    })
  } catch (err) {
    if (err.name !== 'SequelizeUniqueConstraintError') console.error(err.name)
  }
  // await algo.create({
  //   id: 20,
  //   name: 'No Mask'
  // })
  try{
    await algo.create({
      id: 21,
      name: 'Social Distancing'
    })
  } catch (err) {
    if (err.name !== 'SequelizeUniqueConstraintError') console.error(err.name)
  }

  // await algo.create({
  //   id: 21,
  //   name: 'Social Distancing'
  // })
  try{
    await algo.create({
      id: 22,
      name: 'Queue Management'
    })
  } catch (err) {
    if (err.name !== 'SequelizeUniqueConstraintError') console.error(err.name)
  }
  // await algo.create({
  //   id: 22,
  //   name: 'Queue Management'
  // })
  try{
    await algo.create({
      id: 23,
      name: 'Helmet Detection'
    })
  } catch (err) {
    if (err.name !== 'SequelizeUniqueConstraintError') console.error(err.name)
  }
  // await algo.create({
  //   id: 23,
  //   name: 'Helmet Detection'
  // })
  try{
    await algo.create({
      id: 24,
      name: 'Vault Open'
    })
  } catch (err) {
    if (err.name !== 'SequelizeUniqueConstraintError') console.error(err.name)
  }
  // await algo.create({
  //   id: 24,
  //   name: 'Vault Open'
  // })
  try{
    await algo.create({
      id: 25,
      name: 'Barrier Not Closed'
    })
  } catch (err) {
    if (err.name !== 'SequelizeUniqueConstraintError') console.error(err.name)
  }
  // await algo.create({
  //   id: 25,
  //   name: 'Barrier Not Closed'
  // })
  try{
    await algo.create({
      id: 26,
      name: 'Vehicle Counting'
    })
  } catch (err) {
    if (err.name !== 'SequelizeUniqueConstraintError') console.error(err.name)
  }
  // await algo.create({
  //   id: 26,
  //   name: 'Vehicle Counting'
  // })
  try{
    await algo.create({
      id: 27,
      name: 'Camera Tampering'
    })
  } catch (err) {
    if (err.name !== 'SequelizeUniqueConstraintError') console.error(err.name)
  }
  // await algo.create({
  //   id: 27,
  //   name: 'Camera Tampering'
  // })
  try{
    await algo.create({
      id: 28,
      name: 'Animals On Road'
    })
  } catch (err) {
    if (err.name !== 'SequelizeUniqueConstraintError') console.error(err.name)
  }
  // await algo.create({
  //   id: 28,
  //   name: 'Animals On Road'
  // })
  try{
    await algo.create({
      id: 29,
      name: 'Accident Detection'
    })
  } catch (err) {
    if (err.name !== 'SequelizeUniqueConstraintError') console.error(err.name)
  }
  // await algo.create({
  //   id: 29,
  //   name: 'Accident Detection'
  // })
  try{
    await algo.create({
      id: 30,
      name: 'Axle Detection'
    })
  } catch (err) {
    if (err.name !== 'SequelizeUniqueConstraintError') console.error(err.name)
  }
  // await algo.create({
  //   id: 30,
  //   name: 'Axle Detection'
  // })
  try{
    await algo.create({
      id: 31,
      name: 'Carmake'
    })
  } catch (err) {
    if (err.name !== 'SequelizeUniqueConstraintError') console.error(err.name)
  }
  // await algo.create({
  //   id: 31,
  //   name: 'Carmake'
  // })
  try{
    await algo.create({
      id: 32,
      name: 'Clothing'
    })
  } catch (err) {
    if (err.name !== 'SequelizeUniqueConstraintError') console.error(err.name)
  }
  // await algo.create({
  //   id: 32,
  //   name: 'Clothing'
  // })
  try{
    await algo.create({
      id: 33,
      name: 'Vehicle Count at Screen'
    })
  } catch (err) {
    if (err.name !== 'SequelizeUniqueConstraintError') console.error(err.name)
  }
  // await algo.create({
  //   id: 33,
  //   name: 'Vehicle Count at Screen'
  // })
  try{
    await algo.create({
      id: 34,
      name: 'Car Brand'
    })
  } catch (err) {
    if (err.name !== 'SequelizeUniqueConstraintError') console.error(err.name)
  }
  // await algo.create({
  //   id: 34,
  //   name: 'Car Brand'
  // })
  try{
    await algo.create({
      id: 35,
      name: 'Weapon'
    })
  } catch (err) {
    if (err.name !== 'SequelizeUniqueConstraintError') console.error(err.name)
  }
  // await algo.create({
  //   id: 35,
  //   name: 'Weapon'
  // })
  try{
    await algo.create({
      id: 36,
      name: 'Bottle'
    })
  } catch (err) {
    if (err.name !== 'SequelizeUniqueConstraintError') console.error(err.name)
  }
  // await algo.create({
  //   id: 36,
  //   name: 'Bottle'
  // })
  try{
    await algo.create({
      id: 37,
      name: 'People Path'
    })
  } catch (err) {
    if (err.name !== 'SequelizeUniqueConstraintError') console.error(err.name)
  }
  // await algo.create({
  //   id: 37,
  //   name: 'People Path'
  // })
  try{
    await algo.create({
      id: 38,
      name: 'Person Collapsing'
    })
  } catch (err) {
    if (err.name !== 'SequelizeUniqueConstraintError') console.error(err.name)
  }
  // await algo.create({
  //   id: 38,
  //   name: 'Person Collapsing'
  // })
  try{
    await algo.create({
      id: 39,
      name: 'Fire Detection'
    })
  } catch (err) {
    if (err.name !== 'SequelizeUniqueConstraintError') console.error(err.name)
  }
  // await algo.create({
  //   id: 39,
  //   name: 'Fire Detection'
  // })
  try{
    await algo.create({
      id: 40,
      name: 'Pulling Hair'
    })
  } catch (err) {
    if (err.name !== 'SequelizeUniqueConstraintError') console.error(err.name)
  }
  // await algo.create({
  //   id: 40,
  //   name: 'Pulling Hair'
  // })
  try{
    await algo.create({
      id: 41,
      name: 'Waving Hands'
    })
  } catch (err) {
    if (err.name !== 'SequelizeUniqueConstraintError') console.error(err.name)
  }
  // await algo.create({
  //   id: 41,
  //   name: 'Waving Hands'
  // })
  try{
    await algo.create({
      id: 42,
      name: 'Smoking'
    })
  } catch (err) {
    if (err.name !== 'SequelizeUniqueConstraintError') console.error(err.name)
  }
  // await algo.create({
  //   id: 42,
  //   name: 'Smoking'
  // })
  try{
    await algo.create({
      id: 43,
      name: 'Crowd'
    })
  } catch (err) {
    if (err.name !== 'SequelizeUniqueConstraintError') console.error(err.name)
  }

  // await algo.create({
  //   id: 43,
  //   name: 'Crowd'
  // })
  try{
    await algo.create({
      id: 44,
      name: 'Slapping'
    })
  } catch (err) {
    if (err.name !== 'SequelizeUniqueConstraintError') console.error(err.name)
  }
  // await algo.create({
  //   id: 44,
  //   name: 'Slapping'
  // })
  try{
    await algo.create({
      id: 45,
      name: 'Blocking'
    })
  } catch (err) {
    if (err.name !== 'SequelizeUniqueConstraintError') console.error(err.name)
  }
  // await algo.create({
  //   id: 45,
  //   name: 'Blocking'
  // })
  try{
    await algo.create({
      id: 46,
      name: 'Running'
    })
  } catch (err) {
    if (err.name !== 'SequelizeUniqueConstraintError') console.error(err.name)
  }
  // await algo.create({
  //   id: 46,
  //   name: 'Running'
  // })
  try{
    await algo.create({
      id: 47,
      name: 'Disrobing'
    })
  } catch (err) {
    if (err.name !== 'SequelizeUniqueConstraintError') console.error(err.name)
  }
  // await algo.create({
  //   id: 47,
  //   name: 'Disrobing'
  // })
  try{
    await algo.create({
      id: 48,
      name: 'Purse Snatching'
    })
  } catch (err) {
    if (err.name !== 'SequelizeUniqueConstraintError') console.error(err.name)
  }
  // await algo.create({
  //   id: 48,
  //   name: 'Purse Snatching'
  // })
  try{
    await algo.create({
      id: 49,
      name: 'Following'
    })
  } catch (err) {
    if (err.name !== 'SequelizeUniqueConstraintError') console.error(err.name)
  }
  // await algo.create({
  //   id: 49,
  //   name: 'Following'
  // })
  try{
    await algo.create({
      id: 50,
      name: 'Pushing'
    })
  } catch (err) {
    if (err.name !== 'SequelizeUniqueConstraintError') console.error(err.name)
  }
  // await algo.create({
  //   id: 50,
  //   name: 'Pushing'
  // })
  try{
    await algo.create({
      id: 51,
      name: 'People Tracking'
    })
  } catch (err) {
    if (err.name !== 'SequelizeUniqueConstraintError') console.error(err.name)
  }
  // await algo.create({
  //   id: 51,
  //   name: 'People Tracking'
  // })
  try{
    await algo.create({
      id: 52,
      name: 'Transpassing'
    })
  } catch (err) {
    if (err.name !== 'SequelizeUniqueConstraintError') console.error(err.name)
  }
  // await algo.create({
  //   id: 52,
  //   name: 'Transpassing'
  // })
  try{
    await algo.create({
      id: 53,
      name: 'Camera Defocused'
    })
  } catch (err) {
    if (err.name !== 'SequelizeUniqueConstraintError') console.error(err.name)
  }
  // await algo.create({
  //   id: 53,
  //   name: 'Camera Defocused'
  // })
  try{
    await algo.create({
      id: 54,
      name: 'Camera Blinded'
    })
  } catch (err) {
    if (err.name !== 'SequelizeUniqueConstraintError') console.error(err.name)
  }
  // await algo.create({
  //   id: 54,
  //   name: 'Camera Blinded'
  // })
  try{
    await algo.create({
      id: 55,
      name: 'Scene Change'
    })
  } catch (err) {
    if (err.name !== 'SequelizeUniqueConstraintError') console.error(err.name)
  }
  // await algo.create({
  //   id: 55,
  //   name: 'Scene Change'
  // })
  try{
    await algo.create({
      id: 56,
      name: 'Object Removal'
    })
  } catch (err) {
    if (err.name !== 'SequelizeUniqueConstraintError') console.error(err.name)
  }
  // await algo.create({
  //   id: 56,
  //   name: 'Object Removal'
  // })
  try{
    await algo.create({
      id: 57,
      name: 'Smoke Detection'
    })
  } catch (err) {
    if (err.name !== 'SequelizeUniqueConstraintError') console.error(err.name)
  }
  // await algo.create({
  //   id: 57,
  //   name: 'Smoke Detection'
  // })
  try{
    await algo.create({
      id: 58,
      name: 'Velocity'
    })
  } catch (err) {
    if (err.name !== 'SequelizeUniqueConstraintError') console.error(err.name)
  }
  // await algo.create({
  //   id: 58,
  //   name: 'Velocity'
  // })
  try{
    await algo.create({
      id: 59,
      name: 'Enter / Exit'
    })
  } catch (err) {
    if (err.name !== 'SequelizeUniqueConstraintError') console.error(err.name)
  }
  // await algo.create({
  //   id: 59,
  //   name: 'Enter / Exit'
  // })
  try{
    await algo.create({
      id: 60,
      name: 'No Exit'
    })
  } catch (err) {
    if (err.name !== 'SequelizeUniqueConstraintError') console.error(err.name)
  }
  // await algo.create({
  //   id: 60,
  //   name: 'No Exit'
  // })
  try{
    await algo.create({
      id: 61,
      name: 'Harrasment'
    })
  } catch (err) {
    if (err.name !== 'SequelizeUniqueConstraintError') console.error(err.name)
  }
  // await algo.create({
  //   id: 61,
  //   name: 'Harrasment'
  // })
  try{
    await algo.create({
      id: 62,
      name: 'Abduction'
    })
  } catch (err) {
    if (err.name !== 'SequelizeUniqueConstraintError') console.error(err.name)
  }
  // await algo.create({
  //   id: 62,
  //   name: 'Abduction'
  // })
  try{
    await algo.create({
      id: 63,
      name: 'Direction of car'
    })
  } catch (err) {
    if (err.name !== 'SequelizeUniqueConstraintError') console.error(err.name)
  }
  // await algo.create({
  //   id: 63,
  //   name: 'Direction of car'
  // })
  try{
    await algo.create({
      id: 64,
      name: 'Video Signal Lost'
    })
  } catch (err) {
    if (err.name !== 'SequelizeUniqueConstraintError') console.error(err.name)
  }
  // await algo.create({
  //   id: 64,
  //   name: 'Video Signal Lost'
  // })
  try{
    await algo.create({
      id: 65,
      name: 'Vehicle entered / exited restricted area'
    })
  } catch (err) {
    if (err.name !== 'SequelizeUniqueConstraintError') console.error(err.name)
  }
  // await algo.create({
  //   id: 65,
  //   name: 'Vehicle entered / exited restricted area'
  // })
  try{
    await algo.create({
      id: 66,
      name: 'Incipient fire / fire detection'
    })
  } catch (err) {
    if (err.name !== 'SequelizeUniqueConstraintError') console.error(err.name)
  }
  // await algo.create({
  //   id: 66,
  //   name: 'Incipient fire / fire detection'
  // })
  try{
    await algo.create({
      id: 67,
      name: 'People in the tunnel'
    })
  } catch (err) {
    if (err.name !== 'SequelizeUniqueConstraintError') console.error(err.name)
  }
  // await algo.create({
  //   id: 67,
  //   name: 'People in the tunnel'
  // })
  try{
    await algo.create({
      id: 68,
      name: 'Meat / Ham & Cheese'
    })
  } catch (err) {
    if (err.name !== 'SequelizeUniqueConstraintError') console.error(err.name)
  }
  // await algo.create({
  //   id: 68,
  //   name: 'Meat / Ham & Cheese'
  // })
  const lastId = 74
  try{
    await usr.create({
      id: '3333-666666-cccccc-nnnnnn',
      username: 'testing',
      password: bcrypt.hashSync('Graymatics1!', 12),
      email: 'testing@graymatics.com',
      role: 'client',
      id_account: '3333-666666-cccccc-nnnnnn',
      id_branch: '3333-666666-cccccc-nnnnnn',
      cameras: 9999,
      analytics: 9999,
      disabled: 0
    })
  } catch (err) {
    if (err.name !== 'SequelizeUniqueConstraintError') console.error(err.name)
  }
  // await usr.create({
  //   id: '3333-666666-cccccc-nnnnnn',
  //   username: 'testing',
  //   password: bcrypt.hashSync('Graymatics1!', 12),
  //   email: 'testing@graymatics.com',
  //   role: 'client',
  //   id_account: '3333-666666-cccccc-nnnnnn',
  //   id_branch: '3333-666666-cccccc-nnnnnn',
  //   cameras: 9999,
  //   analytics: 9999,
  //   disabled: 0
  // })
  const pathPic = `${path}3333-666666-cccccc-nnnnnn`
  if (!fs.existsSync(pathPic)) {
    await fs.promises.mkdir(pathPic)
    const pathBranch = `${pathPic}/3333-666666-cccccc-nnnnnn`
    await fs.promises.mkdir(pathBranch)
    await fs.promises.mkdir(`${pathBranch}/pictures`)
    await fs.promises.mkdir(`${pathBranch}/heatmap_pics`)
  }
  for (let i = 0; i <= lastId; i++) {
    try {
      await aa.create({
        algoId: i,
        accountId: '3333-666666-cccccc-nnnnnn'
      })
    } catch (err) {
      if (err.name !== 'SequelizeUniqueConstraintError') console.error(err.name)
    }
  }
}
// INSERT INTO `multi_tenant`.`algorithms` (`id`, `name`, `createdAt`, `updatedAt`) VALUES ('27', 'Camera Tampering', '2020-10-05 07:31:29', '2020-10-05 07:31:29');
exports.lastId = 74