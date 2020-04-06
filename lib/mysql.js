const mysql = require('mysql');

var pool  = mysql.createPool({
    connectionLimit : 10,
    timeout         : 60 * 60 * 1000,
    host            : process.env.DB_HOST,
    user            : process.env.DB_USER,
    password        : process.env.DB_PASS,
    database        : process.env.DB_DB
});

 module.exports = {mysql, pool};