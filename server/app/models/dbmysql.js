const mysql = require('mysql')
require('dotenv').config({ path: '../../config.env' })

const connection = {
  con: function () {
    if (!this.pool) {
      this.pool = mysql.createPool({
        host: process.env.HOST,
        user: process.env.USERM,
        password: process.env.PASSWORD,
        database: process.env.DB,
        connectionLimit: 40
      })

      this.pool.on('acquire', function (connection) {
        console.log(
          'Connection %d acquired. No of connnections: %d',
          connection.threadId,
          this._acquiringConnections.length + 1
        )
      })

      this.pool.on('connection', function (connection) {
        console.log(
          'New connection created. No of connections: %d',
          this._acquiringConnections.length + 1
        )
      })
      this.pool.on('enqueue', function () {
        console.log('Waiting for available connection slot')
      })
      this.pool.on('release', function (connection) {
        console.log('Connection %d released', connection.threadId)
      })
    }
    return this.pool
  }
}

module.exports = connection
