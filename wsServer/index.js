const express = require('express');
const compression = require('compression')
const cors = require('cors')
const bodyParser = require('body-parser')
require('dotenv').config({ path: '../config.env' })
const enableWs = require('express-ws')
const morgan = require('morgan')
const fs = require('fs')
const path = require('path')
const resourcesFolderPath = path.resolve(__dirname, './resources/pictures')
const picResourceFolderPath = path.join(resourcesFolderPath)

//init Express
const app = express();
enableWs(app)
//init Express Router
express.Router();
const port = process.env.PORTWS || 3301;

app.use(compression())
app.use(bodyParser.json({ limit: '10mb', extended: true }))
// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }))

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
  console.log(`Running on Production on http://${process.env.my_ip}:${process.env.PORTWS}`)
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
  console.log(`Running Dev version on port ${process.env.PORTWS}`)
}

app.use(
  morgan(
    'Method: :method:url // Url: :remote-addr // Status::status // User-agent: :user-agent // Date: :date[web]'
  )
)
app.use(
  morgan(
    'Date: :date[web] // Url: :remote-addr // Method: :method:url // Status::status // User-agent: :user-agent',
    {
      stream: fs.createWriteStream('./resources/logs/wsAccess.log', { flags: 'a' })
    }
  )
)

function customHeaders (req, res, next) {
  app.disable('X-Powered-By')
  res.setHeader('X-Powered-By', 'Graymatics-server')

  res.setHeader('Content-Security-Policy', "default-src 'self'")

  res.setHeader('X-Frame-Options', 'SAMEORIGIN')

  next()
}

app.use(customHeaders)

require('./routes/info.route')(app)
require('./routes/ws.route')(app)

app.use('/api/pictures', express.static(picResourceFolderPath))

app.listen(port)
