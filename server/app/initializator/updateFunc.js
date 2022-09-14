const db = require('../models')
const algo = db.algorithm

exports.initial = async function () {
  await algo.update({
    name: 'Fila tradicional'
  },
  {
    where: { id: 22 }
  })
  await algo.update({
    name: 'Carnes / Jamon & Queso'
  },
  {
    where: { id: 68 }
  })
  await algo.create({
    id: 69,
    name: 'Temperatura y disponibilidad Pan'
  })
}
