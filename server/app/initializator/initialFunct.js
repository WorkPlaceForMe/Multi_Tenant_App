const db = require('../models')
const usr = db.user
const algo = db.algorithm
const aa = db.aa
const bcrypt = require('bcryptjs')
const fs = require('fs')

exports.initial = async function () {
  const path =
  process.env.home + process.env.username + process.env.pathDocker + process.env.resources
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
  await algo.create({
    id: 0,
    name: 'Facial Recognition'
  })
  await algo.create({
    id: 1,
    name: 'Person Climbing Barricade'
  })
  await algo.create({
    id: 2,
    name: 'Loitering Detection'
  })
  await algo.create({
    id: 3,
    name: 'D&C of human, animal and vehicle'
  })
  await algo.create({
    id: 4,
    name: 'Parking Violation'
  })
  await algo.create({
    id: 5,
    name: 'Speeding Vehicle'
  })
  await algo.create({
    id: 6,
    name: 'Helmet detection on two-wheeler'
  })
  await algo.create({
    id: 7,
    name: 'Banned vehicle detection'
  })
  await algo.create({
    id: 8,
    name: 'Wrong way or illegal turn detection'
  })
  await algo.create({
    id: 9,
    name: 'Graffiti & Vandalism detection'
  })
  await algo.create({
    id: 10,
    name: 'Debris & Garbage detection'
  })
  await algo.create({
    id: 11,
    name: 'Garbage bin, cleanned or not'
  })
  await algo.create({
    id: 12,
    name: 'People Count'
  })
  await algo.create({
    id: 13,
    name: 'ANPR'
  })
  await algo.create({
    id: 14,
    name: 'Heatmap'
  })
  await algo.create({
    id: 15,
    name: 'Demographics'
  })
  await algo.create({
    id: 16,
    name: 'Abandoned Object'
  })
  await algo.create({
    id: 17,
    name: 'Intrusion Alert'
  })
  await algo.create({
    id: 18,
    name: 'Attendance Management'
  })
  await algo.create({
    id: 19,
    name: 'Violence'
  })
  await algo.create({
    id: 20,
    name: 'No Mask'
  })
  await algo.create({
    id: 21,
    name: 'Social Distancing'
  })
  await algo.create({
    id: 22,
    name: 'Queue Management'
  })
  await algo.create({
    id: 23,
    name: 'Helmet Detection'
  })
  await algo.create({
    id: 24,
    name: 'Vault Open'
  })
  await algo.create({
    id: 25,
    name: 'Barrier Not Closed'
  })
  await algo.create({
    id: 26,
    name: 'Vehicle Counting'
  })
  await algo.create({
    id: 27,
    name: 'Camera Tampering'
  })
  await algo.create({
    id: 28,
    name: 'Animals On Road'
  })
  await algo.create({
    id: 29,
    name: 'Accident Detection'
  })
  await algo.create({
    id: 30,
    name: 'Axle Detection'
  })
  await algo.create({
    id: 31,
    name: 'Carmake'
  })
  await algo.create({
    id: 32,
    name: 'Clothing'
  })
  await algo.create({
    id: 33,
    name: 'Vehicle Count at Screen'
  })
  await algo.create({
    id: 34,
    name: 'Car Brand'
  })
  await algo.create({
    id: 35,
    name: 'Weapon'
  })
  await algo.create({
    id: 36,
    name: 'Bottle'
  })
  await algo.create({
    id: 37,
    name: 'People Path'
  })
  await algo.create({
    id: 38,
    name: 'Person Collapsing'
  })
  await algo.create({
    id: 39,
    name: 'Fire Detection'
  })
  await algo.create({
    id: 40,
    name: 'Pulling Hair'
  })
  await algo.create({
    id: 41,
    name: 'Waving Hands'
  })
  await algo.create({
    id: 42,
    name: 'Smoking'
  })
  await algo.create({
    id: 43,
    name: 'Crowd'
  })
  await algo.create({
    id: 44,
    name: 'Slapping'
  })
  await algo.create({
    id: 45,
    name: 'Blocking'
  })
  await algo.create({
    id: 46,
    name: 'Running'
  })
  await algo.create({
    id: 47,
    name: 'Disrobing'
  })
  await algo.create({
    id: 48,
    name: 'Purse Snatching'
  })
  await algo.create({
    id: 49,
    name: 'Following'
  })
  await algo.create({
    id: 50,
    name: 'Pushing'
  })
  await algo.create({
    id: 51,
    name: 'People Tracking'
  })
  await algo.create({
    id: 52,
    name: 'Transpassing'
  })
  await algo.create({
    id: 53,
    name: 'Camera Defocused'
  })
  await algo.create({
    id: 54,
    name: 'Camera Blinded'
  })
  await algo.create({
    id: 55,
    name: 'Scene Change'
  })
  await algo.create({
    id: 56,
    name: 'Object Removal'
  })
  await algo.create({
    id: 57,
    name: 'Smoke Detection'
  })
  await algo.create({
    id: 58,
    name: 'Velocity'
  })
  await algo.create({
    id: 59,
    name: 'Enter / Exit'
  })
  await algo.create({
    id: 60,
    name: 'No Exit'
  })
  await algo.create({
    id: 61,
    name: 'Harrasment'
  })
  await algo.create({
    id: 62,
    name: 'Abduction'
  })
  await algo.create({
    id: 63,
    name: 'Direction of car'
  })
  await algo.create({
    id: 64,
    name: 'Video Signal Lost'
  })
  await algo.create({
    id: 65,
    name: 'Vehicle entered / exited restricted area'
  })
  await algo.create({
    id: 66,
    name: 'Incipient fire / fire detection'
  })
  await algo.create({
    id: 67,
    name: 'People in the tunnel'
  })
  const lastId = 67
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
  const pathPic = `${path}3333-666666-cccccc-nnnnnn`
  if (!fs.existsSync(pathPic)) {
    await fs.promises.mkdir(pathPic)
    const pathBranch = `${pathPic}/3333-666666-cccccc-nnnnnn`
    await fs.promises.mkdir(pathBranch)
    await fs.promises.mkdir(`${pathBranch}/pictures`)
    await fs.promises.mkdir(`${pathBranch}/heatmap_pics`)
  }
  for (let i = 0; i <= lastId; i++) {
    aa.create({
      algoId: i,
      accountId: '3333-666666-cccccc-nnnnnn'
    })
  }
}
// INSERT INTO `multi_tenant`.`algorithms` (`id`, `name`, `createdAt`, `updatedAt`) VALUES ('27', 'Camera Tampering', '2020-10-05 07:31:29', '2020-10-05 07:31:29');
