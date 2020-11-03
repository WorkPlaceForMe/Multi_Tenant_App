var mysql=require('mysql');
require('dotenv').config({ path: '../../config.env'});

var connection = {
    con:function(){
    return mysql.createPool({
    host     : process.env.HOST,
    user     : process.env.USERM,
    password : process.env.PASSWORD,
    database : process.env.DB
 });
 }}
 
  module.exports=connection;
 