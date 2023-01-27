const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
require('dotenv').config({ path: '../config.env' })
const app = express()
const morgan = require('morgan')
const fs = require('fs')
const path = require('path')
const init = require('./app/initializator/initialFunct')
const updt = require('./app/initializator/updateFunc')
const mysql = require('mysql2/promise')
const compression = require('compression')
const swaggerJsDoc = require('swagger-jsdoc')
const swaggerUi = require('swagger-ui-express')
const db = require('./app/models')
const usr = db.user
const algo = db.algorithm
// const resourcesFolderPath =
//  process.env.home + process.env.username + process.env.pathDocker + process.env.resources
const resourcesFolderPath = path.resolve(process.env.resourcePath)
const picResourceFolderPath = path.join(resourcesFolderPath)

app.use(compression())

if (process.env.NODE_ENV === 'production') {
  const corsOptions = {
    origin: [
      `http://${process.env.my_ip}:4200`,
      `${process.env.app_url}`,
      'http://localhost:4200',
      `http://${process.env.my_ip}:3200`
    ]
  }
  app.use(cors(corsOptions))
  console.log(`Running on Production for http://${process.env.my_ip}:4200`)
} else {
  const corsOptions = {
    origin: [
      `http://${process.env.my_ip}:4200`,
      `${process.env.app_url}`,
      'http://localhost:4200',
      `http://${process.env.my_ip}:3200`
    ]
  }
  app.use(cors(corsOptions))
  console.log(`Running Dev version on port ${process.env.PORTNODE}`)
}

function customHeaders (req, res, next) {
  app.disable('X-Powered-By')
  res.setHeader('X-Powered-By', 'Graymatics-server')

  res.setHeader('Content-Security-Policy', "default-src 'self'")

  res.setHeader('X-Frame-Options', 'SAMEORIGIN')

  next()
}

app.use(customHeaders)

// parse requests of content-type - application/json
app.use(bodyParser.json({ limit: '100mb', extended: true }))
// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ limit: '100mb', extended: true }))
app.all(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', `http://${process.env.my_ip}:4200`)
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE')
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, x-access-token'
  )
  next()
})

app.use(
  morgan(
    'Method: :method:url // Url: :remote-addr // Status::status // User-agent: :user-agent // Date: :date[web]'
  )
)
app.use(
  morgan(
    'Date: :date[web] // Url: :remote-addr // Method: :method:url // Status::status // User-agent: :user-agent',
    {
      stream: fs.createWriteStream(`${resourcesFolderPath}/logs/access.log`, { flags: 'a' })
    }
  )
)

process.on('unhandledRejection', (error, promise) => {
  console.log(' Oh Lord! We forgot to handle a promise rejection here: ', promise)
  console.log(' The error was: ', error)
})

process.on('uncaughtException', function (err, promise) {
  console.log(' Oh Lord! We forgot to handle a promise rejection here: ', promise)
  console.log(' The error was: ', err)
})

if (process.env.INSTALL === 'true') {
  mysql
    .createConnection({
      user: process.env.USERM,
      password: process.env.PASSWORD,
      host: process.env.HOST
    })
    .then(async connection => {
      console.log('Connected to MySQL...')
      connection.query('CREATE DATABASE IF NOT EXISTS ' + process.env.DB + ';').then(async () => {
        db.sequelize.sync({ force: false, alter: true }).then(async () => {
          console.log('Drop and Resync Db...')
          const find = await usr.findOne({
            where: { id: '0000-11111-aaaaaa-bbbbbb' }
          })
          const span = await algo.findOne({
            where: { id: 69 }
          })
          if (span === null) {
            await updt.initial()
          }
          if (find === null) {
            await init.initial()
          } else {
            const algos = await algo.findAll({
              limit: 1,
              order: [['createdAt', 'DESC']]
            })
            if (init.lastId > algos[0].dataValues.id) {
              await init.initial()
              console.log('Db updated')
            }
          }
          connection.query(
            'CREATE TABLE IF NOT EXISTS `' +
              process.env.DB +
              '`.tickets (`id` varchar(45) NOT NULL,`type` varchar(45) NOT NULL,`createdAt`datetime NOT NULL, `updatedAt` datetime NOT NULL, `assigned` varchar(45) DEFAULT NULL, `id_account` varchar(45) NOT NULL, `id_branch` varchar(45) NOT NULL, `level` int(10) NOT NULL,`cam_name` varchar(45) DEFAULT NULL,`reviewed` varchar(45) DEFAULT NULL, `assignedBy` varchar(45) DEFAULT NULL, PRIMARY KEY (`id`), UNIQUE KEY `id_UNIQUE` (`id`)) ENGINE=InnoDB DEFAULT CHARSET=latin1;'
          )
          connection.query('CREATE TABLE IF NOT EXISTS `' +
          process.env.DB +
          '`.alerts (`id` VARCHAR(45) NOT NULL,`time` DATETIME NULL,`alert` VARCHAR(45) NULL,`cam_name` VARCHAR(45) NULL,`cam_id` VARCHAR(45) NULL,`trackid` INT NULL,`alert_type` INT NULL,`id_account` VARCHAR(45) NULL,`id_branch` VARCHAR(45) NULL, PRIMARY KEY (`id`));')
          console.log('Installed DB')
        })
      })
    })
}

const opt = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Graymatics API',
      version: '5.2.1',
      description: 'Graymatics API Information',
      license: {
        name: 'MIT',
        url: 'https://spdx.org/licenses/MIT.html'
      },
      contact: {
        name: 'Graymatics',
        url: 'https://www.graymatics.com',
        email: 'alex@graymatics.com'
      }
    },
    servers: [
      {
        url: `${process.env.app_url}`,
        description: 'Main'
      },
      {
        url: 'localhost:3311',
        description: 'Local'
      }
    ]
  },
  apis: ['server.js', './app/routes/*.js']
}

const swaggerDocs = swaggerJsDoc(opt)

app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocs, {
    explorer: true,
    customCssUrl: '/api/pictures/swagger.css',
    customSiteTitle: 'Graymatics API Manual',
    customfavIcon: '/api/pictures/favicon1.ico',
    swaggerOptions: {
      url: `${process.env.app_url}/api/pictures/swagger.json`,
      docExpansion: 'none',
      validatorUrl: null
    },
    apis: ['server.js', './app/routes/*.js']
  })
)

// if (1 === 2) {
//   const doc = YAML.dump(swaggerDocs)
//   fs.writeFileSync('./resources/swagger.yaml', doc, 'utf8')
// }

// routes
require('./app/routes/auth.routes')(app)
require('./app/routes/user.routes')(app)
require('./app/routes/fr.routes')(app)
require('./app/routes/image.routes')(app)
require('./app/routes/camera.routes')(app)
require('./app/routes/algorithm.routes')(app)
require('./app/routes/heatmap.routes')(app)
require('./app/routes/relations.routes')(app)
require('./app/routes/schedule.routes')(app)
require('./app/routes/ticket.routes')(app)
require('./app/routes/analytics.routes')(app)
// require('./app/routes/email.routes')(app)
require('./app/routes/elastic.routes')(app)
require('./app/routes/alerts.routes')(app)
require('./app/routes/path.routes')(app)
require('./app/routes/helpdesk.routes')(app)
require('./app/routes/reply.routes')(app)
require('./app/routes/incident.routes')(app)
require('./app/routes/manualTrigger.routes')(app)
require('./app/routes/info.routes')(app)
require('./app/routes/report.routes')(app)

// resources being served
app.use('/api/pictures', express.static(picResourceFolderPath))

// app.use((req, res, next) => {
//   res.sendFile('/app/views/error.html', { root: __dirname })
// })

module.exports = app
