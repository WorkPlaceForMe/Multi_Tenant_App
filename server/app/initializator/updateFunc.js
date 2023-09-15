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
  try{
    await algo.create({
      id: 69,
      name: 'Caja automatica'
    })
  } catch (err) {
    if (err.name !== 'SequelizeUniqueConstraintError') console.error(err.name)
  }
  // await algo.create({
  //   id: 69,
  //   name: 'Caja automatica'
  // })
  try{
    await algo.create({
      id: 70,
      name: 'Disponibilidad Pan'
    })
  } catch (err) {
    if (err.name !== 'SequelizeUniqueConstraintError') console.error(err.name)
  }
  // await algo.create({
  //   id: 70,
  //   name: 'Disponibilidad Pan'
  // })
  try{
    await algo.create({
      id: 71,
      name: 'Temperatura Pan'
    })
  } catch (err) {
    if (err.name !== 'SequelizeUniqueConstraintError') console.error(err.name)
  }
  // await algo.create({
  //   id: 71,
  //   name: 'Temperatura Pan'
  // })
  try{
    await algo.create({
      id: 72,
      name: 'Carnes Procesadas'
    })
  } catch (err) {
    if (err.name !== 'SequelizeUniqueConstraintError') console.error(err.name)
  }
  // await algo.create({
  //   id: 72,
  //   name: 'Carnes Procesadas'
  // })
  try{
    await algo.create({
      id: 73,
      name: 'Conteo De Personal'
    })
  } catch (err) {
    if (err.name !== 'SequelizeUniqueConstraintError') console.error(err.name)
  }
  // await algo.create({
  //   id: 73,
  //   name: 'Conteo De Personal'
  // })
  try{
    await algo.create({
      id: 74,
      name: 'Tiempo De Procesamiento De Carne'
    })
  } catch (err) {
    if (err.name !== 'SequelizeUniqueConstraintError') console.error(err.name)
  }
  // await algo.create({
  //   id: 74,
  //   name: 'Tiempo De Procesamiento De Carne'
  // })
}
exports.lastId = 74