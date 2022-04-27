const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
require('dotenv').config({ path: '../config.env' })
const app = express()
const morgan = require('morgan')
const fs = require('fs')
const path = require('path')
const init = require('./app/initializator/initialFunct')
const mysql = require('mysql2/promise')
const compression = require('compression')
const swaggerJsDoc = require('swagger-jsdoc')
const swaggerUi = require('swagger-ui-express')

const resourcesFolderPath = path.join(process.env.resourcePath)
const assetsFolderPath = path.resolve(__dirname, './resources/')

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
app.use(bodyParser.json({ limit: '10mb', extended: true }))
// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }))
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
      stream: fs.createWriteStream('./access.log', { flags: 'a' })
    }
  )
)

const db = require('./app/models')

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
      host: process.env.HOST,
      port: process.env.DB_PORT
    }).then(connection => {
      connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB}`).then(() => {
        db.sequelize.sync({ force: true }).then(() => {
          console.log('Drop and Resync Db')
          init.initial().then()
        })
      })
    })
}

const opt = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Graymatics API',
      version: '5.0.2',
      description: 'Graymatics API Information',
      // license: {
      //   name: "MIT",
      //   url: "https://spdx.org/licenses/MIT.html",
      // },
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
        description: 'Other'
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
    customCss: `img[alt='Swagger UI'] { content:url(${process.env.app_url}/api/assets/graymaticsLogo.png);}`,
    customSiteTitle: 'Graymatics API Manual',
    customfavIcon: `${process.env.app_url}/api/assets/favicon1.ico`,
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
require('./app/routes/summarization.routes')(app)

// resources being served
app.use('/api/pictures', express.static(resourcesFolderPath))

// assets being served
app.use('/api/assets', express.static(assetsFolderPath))

// client side
// app.use(express.static(process.env.WEBSITE_PATH));

// // 404 re-route
// app.get('*', function(req,res){
//     res.redirect('/');
//   });

module.exports = app
