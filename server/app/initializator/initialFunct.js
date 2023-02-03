const db = require('../models')
const usr = db.user
const algo = db.algorithm
const aa = db.aa
const bcrypt = require('bcryptjs')
const fs = require('fs')

exports.initial = async function () {
  const user = await usr.findOne({
    where: { username: 'admin' }
  })

  if (user) {
    return
  }

  const path = process.env.resourcePath

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

  const algoData = [{
    id: 0,
    name: 'Facial Recognition'
  },
  {
    id: 1,
    name: 'Person Climbing Barricade'
  },
  {
    id: 2,
    name: 'Loitering Detection'
  },
  {
    id: 3,
    name: 'D&C of human, animal and vehicle'
  },
  {
    id: 4,
    name: 'Parking Violation'
  },
  {
    id: 5,
    name: 'Speeding Vehicle'
  },
  {
    id: 6,
    name: 'Helmet detection on two-wheeler'
  },
  {
    id: 7,
    name: 'Banned vehicle detection'
  },
  {
    id: 8,
    name: 'Wrong way or illegal turn detection'
  },
  {
    id: 9,
    name: 'Graffiti & Vandalism detection'
  },
  {
    id: 10,
    name: 'Debris & Garbage detection'
  },
  {
    id: 11,
    name: 'Garbage bin, cleanned or not'
  },
  {
    id: 12,
    name: 'People Count'
  },
  {
    id: 13,
    name: 'ANPR'
  },
  {
    id: 14,
    name: 'Heatmap'
  },
  {
    id: 15,
    name: 'Demographics'
  },
  {
    id: 16,
    name: 'Abandoned Object'
  },
  {
    id: 17,
    name: 'Intrusion Alert'
  },
  {
    id: 18,
    name: 'Attendance Management'
  },
  {
    id: 19,
    name: 'Violence'
  },
  {
    id: 20,
    name: 'No Mask'
  },
  {
    id: 21,
    name: 'Social Distancing'
  },
  {
    id: 22,
    name: 'Queue Management'
  },
  {
    id: 23,
    name: 'Helmet Detection'
  },
  {
    id: 24,
    name: 'Vault Open'
  },
  {
    id: 25,
    name: 'Barrier Not Closed'
  },
  {
    id: 26,
    name: 'Vehicle Counting'
  },
  {
    id: 27,
    name: 'Camera Tampering'
  },
  {
    id: 28,
    name: 'Animals On Road'
  },
  {
    id: 29,
    name: 'Accident Detection'
  },
  {
    id: 30,
    name: 'Axle Detection'
  },
  {
    id: 31,
    name: 'Carmake'
  },
  {
    id: 32,
    name: 'Clothing'
  },
  {
    id: 33,
    name: 'Vehicle Count at Screen'
  },
  {
    id: 34,
    name: 'Car Brand'
  },
  {
    id: 35,
    name: 'Weapon'
  },
  {
    id: 36,
    name: 'Bottle'
  },
  {
    id: 37,
    name: 'People Path'
  },
  {
    id: 38,
    name: 'Person Collapsing'
  },
  {
    id: 39,
    name: 'Fire Detection'
  },
  {
    id: 40,
    name: 'Pulling Hair'
  },
  {
    id: 41,
    name: 'Waving Hands'
  },
  {
    id: 42,
    name: 'Smoking'
  },
  {
    id: 43,
    name: 'Crowd'
  },
  {
    id: 44,
    name: 'Slapping'
  },
  {
    id: 45,
    name: 'Blocking'
  },
  {
    id: 46,
    name: 'Running'
  },
  {
    id: 47,
    name: 'Disrobing'
  },
  {
    id: 48,
    name: 'Purse Snatching'
  },
  {
    id: 49,
    name: 'Following'
  },
  {
    id: 50,
    name: 'Pushing'
  },
  {
    id: 51,
    name: 'People Tracking'
  },
  {
    id: 52,
    name: 'Transpassing'
  },
  {
    id: 53,
    name: 'Camera Defocused'
  },
  {
    id: 54,
    name: 'Camera Blinded'
  },
  {
    id: 55,
    name: 'Scene Change'
  },
  {
    id: 56,
    name: 'Object Removal'
  },
  {
    id: 57,
    name: 'Smoke Detection'
  },
  {
    id: 58,
    name: 'Velocity'
  },
  {
    id: 59,
    name: 'Enter / Exit'
  },
  {
    id: 60,
    name: 'No Exit'
  },
  {
    id: 61,
    name: 'Harrasment'
  },
  {
    id: 62,
    name: 'Abduction'
  },
  {
    id: 63,
    name: 'Direction of car'
  },
  {
    id: 64,
    name: 'Video Signal Lost'
  },
  {
    id: 65,
    name: 'Vehicle entered / exited restricted area'
  },
  {
    id: 66,
    name: 'Incipient fire / fire detection'
  },
  {
    id: 67,
    name: 'People in the tunnel'
  },
  {
    id: 68,
    name: 'Meat / Ham & Cheese'
  },
  {
    id: 69,
    name: 'Black / White list'
  }]

  algoData.forEach(async (item, index) => {
    await algo.create({
      id: item.id,
      name: item.name
    })

    await aa.create({
      algoId: item.id,
      accountId: '3333-666666-cccccc-nnnnnn'
    })
  })
}
