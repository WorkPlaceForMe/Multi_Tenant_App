const db = require("../models");
const usr = db.user;
const algo = db.algorithm;
const bcrypt = require("bcryptjs");

exports.initial = function() {
    usr.create({
      id: "0000-11111-aaaaaa-bbbbbb",
      username: "admin",
      password: bcrypt.hashSync("graymatics", 12),
      email:"test@graymatics.com",
      role:"admin",
      id_account:"0000",
      id_branch:"0000",
      disabled: 0
    })
    algo.create({
        id: 0,
        name: 'Facial Recognition'
    })
    algo.create({
        id: 1,
        name: 'Person Climbing Barricade'
      })
    algo.create({
        id: 2,
        name: 'Loitering Detection'
    })
    algo.create({
        id: 3,
        name: 'D&C of human, animal and vehicle'
    })
    algo.create({
        id: 4,
        name: 'Parking Violation'
    })
    algo.create({
        id: 5,
        name: 'Speeding Vehicle'
      })
    algo.create({
        id: 6,
        name: 'Helmet detection on two-wheeler'
    })
    algo.create({
        id: 7,
        name: 'Banned vehicle detection'
    })
    algo.create({
        id: 8,
        name: 'Wrong way or illegal turn detection'
    })
    algo.create({
        id: 9,
        name: 'Graffiti & Vandalism detection'
      })
    algo.create({
        id: 10,
        name: 'Debris & Garbage detection'
    })
    algo.create({
        id: 11,
        name: 'Garbage bin, cleanned or not'
    })
    algo.create({
        id: 12,
        name: 'People Count'
    })
    algo.create({
        id: 13,
        name: 'ANPR'
      })
    algo.create({
        id: 14,
        name: 'Heatmap'
    })
    algo.create({
        id: 15,
        name: 'Demographics'
    })
    algo.create({
        id: 16,
        name: 'Abandoned Object'
    })
    algo.create({
        id: 17,
        name: 'Intrusion Alert'
      })
      algo.create({
        id: 18,
        name: 'Attendance Management'
      })
      algo.create({
        id: 19,
        name: 'Violence'
      })
      algo.create({
        id: 20,
        name: 'No Mask'
      })
      algo.create({
        id: 21,
        name: 'Social Distancing'
      })
      algo.create({
        id: 22,
        name: 'Queue Management'
      })
      algo.create({
        id: 23,
        name: 'Helmet Detection'
      })
      algo.create({
        id: 24,
        name: 'Vault Open'
      })
}