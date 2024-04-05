const mysql = require('mysql2');

require('dotenv').config();


const pool = mysql.createPool({
    connectionLimit: 10,
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DBNAME,
  });

  // now get a Promise wrapped instance of that pool
module.exports = pool.promise();