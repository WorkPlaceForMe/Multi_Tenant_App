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
    name: 'Caja automatica'
  })
  await algo.create({
    id: 70,
    name: 'Disponibilidad Pan'
  })
  await algo.create({
    id: 71,
    name: 'Temperatura Pan'
  })
  await algo.create({
    id: 72,
    name: 'Carnes Procesadas'
  })
  await algo.create({
    id: 73,
    name: 'Conteo De Personal'
  })
  await algo.create({
    id: 74,
    name: 'Tiempo De Procesamiento De Carne'
  })
}
exports.lastId = 74