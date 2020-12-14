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

const resourcesFolderPath = process.env.home + process.env.username + process.env.pathDocker + process.env.resources
const picResourceFolderPath = path.join(resourcesFolderPath);

app.use(compression())

if(process.env.NODE_ENV === 'production'){
    var corsOptions = {
        origin: `http://${process.env.my_ip}:${process.env.PORT}`,
        credentials: true,
        origin: true
      };
      app.options('*',cors(corsOptions));
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

if(process.env.INSTALL === 'true'){
  mysql.createConnection({
    user     : process.env.USERM,
    password : process.env.PASSWORD,
    host     : process.env.HOST,
}).then((connection) => {
    connection.query("CREATE DATABASE IF NOT EXISTS "+ process.env.DB + ";").then(() => {
        // Safe to use sequelize now
        db.sequelize.sync({force: true}).then(() => {
            init.initial();
            console.log('Drop and Resync Db');
          connection.query("CREATE TABLE IF NOT EXISTS "+ process.env.DB +".tickets (`id` varchar(45) NOT NULL,`type` varchar(45) NOT NULL,`createdAt`datetime NOT NULL, `updatedAt` datetime NOT NULL, `assigned` varchar(45) DEFAULT NULL, `id_account` varchar(45) NOT NULL, `id_branch` varchar(45) NOT NULL, `level` int(10) NOT NULL,`reviewed` varchar(45) DEFAULT NULL, `assignedBy` varchar(45) DEFAULT NULL, PRIMARY KEY (`id`), UNIQUE KEY `id_UNIQUE` (`id`)) ENGINE=InnoDB DEFAULT CHARSET=latin1;")
        });
    })
})
}

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

const ALGO_CONFIG = process.env.ALGO_CONFIG || '{ "algo_fr": 3301, "algo_am": 3302 }'
    let algoConfigs
    try {    
        algoConfigs = JSON.parse(ALGO_CONFIG)
    }
    catch(err) {
        console.error(`ALGO_CONFIG malformed. Skipping algo proxying: ${JSON.stringify(err)}`)
    }

// client side
app.use(express.static(process.env.WEBSITE_PATH));

// 404 re-route
app.get('*', function(req,res){
    res.redirect('/');
  });

module.exports = app