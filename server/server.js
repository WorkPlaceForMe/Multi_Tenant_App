const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require('dotenv').config({ path: './config.env'});
const app = express();
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');
const init = require('./app/initializator/initialFunct')
const mysql=require('mysql2/promise');
var compression = require('compression')
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const YAML = require('js-yaml');

const resourcesFolderPath = process.env.home + process.env.username + process.env.pathDocker + process.env.resources
const picResourceFolderPath = path.join(resourcesFolderPath);

app.use(compression())

if(process.env.NODE_ENV === 'production'){
    var corsOptions = {
        origin: `http://${process.env.my_ip}:4200`
      };
      app.use(cors(corsOptions));
      console.log('Running on Production')
}

// parse requests of content-type - application/json
app.use(bodyParser.json({limit: '10mb', extended: true}));
// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({limit: '10mb', extended: true}));
app.all(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-access-token");
    next();
});

app.use(morgan('Method: :method:url // Url: :remote-addr // Status::status // User-agent: :user-agent // Date: :date[web]'));
app.use(morgan('Date: :date[web] // Url: :remote-addr // Method: :method:url // Status::status // User-agent: :user-agent', {
    stream: fs.createWriteStream('./access.log', {flags: 'a'})
}));

const db = require("./app/models");

process.on('unhandledRejection', (error, promise) => {
    console.log(' Oh Lord! We forgot to handle a promise rejection here: ', promise);
    console.log(' The error was: ', error );
  });

process.on('uncaughtException', function (err, promise) {
    console.log(' Oh Lord! We forgot to handle a promise rejection here: ', promise);
    console.log(' The error was: ', err );
});

if(process.env.INSTALL === 'true'){
  mysql.createConnection({
    user     : process.env.USERM,
    password : process.env.PASSWORD,
    host     : process.env.HOST,
}).then((connection) => {
    connection.query("CREATE DATABASE IF NOT EXISTS "+ process.env.DB + ";").then(() => {
        // Safe to use sequelize now
        db.sequelize.sync({force: true}).then(() => {
          console.log('Drop and Resync Db');
          init.initial();
          connection.query("CREATE TABLE IF NOT EXISTS "+ process.env.DB +".tickets (`id` varchar(45) NOT NULL,`type` varchar(45) NOT NULL,`createdAt`datetime NOT NULL, `updatedAt` datetime NOT NULL, `assigned` varchar(45) DEFAULT NULL, `id_account` varchar(45) NOT NULL, `id_branch` varchar(45) NOT NULL, `level` int(10) NOT NULL,`reviewed` varchar(45) DEFAULT NULL, `assignedBy` varchar(45) DEFAULT NULL, PRIMARY KEY (`id`), UNIQUE KEY `id_UNIQUE` (`id`)) ENGINE=InnoDB DEFAULT CHARSET=latin1;")
        });
    })
})
}

const opt = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Graymatics API",
      version: "5.0.2",
      description:
        "Graymatics API Information",
      // license: {
      //   name: "MIT",
      //   url: "https://spdx.org/licenses/MIT.html",
      // },
      contact: {
        name: "Graymatics",
        url: "https://www.graymatics.com",
        email: "alex@graymatics.com",
      },
    },
    servers: [
      {
        url: `http://${process.env.my_ip}:${process.env.PORT}`,
      },
    ],
  },
  apis: ["server.js","./app/routes/*.js"],
};


const swaggerDocs = swaggerJsDoc(opt);

if(1 == 2){
  const doc = YAML.dump(swaggerDocs);
  fs.writeFileSync('./resources/swagger.yaml', doc, 'utf8')
};

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs, {
  explorer: true, 
  customCss: `img[alt='Swagger UI'] { content:url(http://${process.env.my_ip}:${process.env.PORT}/api/pictures/graymaticsLogo.png);}`,
  customSiteTitle: "Graymatics API Manual",
  customfavIcon: `http://${process.env.my_ip}:${process.env.PORT}/api/pictures/favicon1.ico`,
  swaggerOptions: {
    url:`http://${process.env.my_ip}:${process.env.PORT}/api/pictures/swagger.json`,
    docExpansion: 'none',
    validatorUrl: null
  },
}));

// routes
require('./app/routes/auth.routes')(app);
require('./app/routes/user.routes')(app);
require('./app/routes/fr.routes')(app);
require('./app/routes/image.routes')(app);
require('./app/routes/camera.routes')(app);
require('./app/routes/algorithm.routes')(app);
require('./app/routes/heatmap.routes')(app);
require('./app/routes/relations.routes')(app);
require('./app/routes/schedule.routes')(app);
require('./app/routes/ticket.routes')(app);
require('./app/routes/analytics.routes')(app);

//resources being served
app.use('/api/pictures', express.static(picResourceFolderPath))

// client side
// app.use(express.static(process.env.WEBSITE_PATH));

// // 404 re-route
// app.get('*', function(req,res){
//     res.redirect('/');
//   });

module.exports = app