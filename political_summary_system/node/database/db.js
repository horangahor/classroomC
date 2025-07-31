const mysql = require("mysql2/promise");


const pool = mysql.createPool({
    host : '192.168.111.216',
    user : 'hanmadi', 
    password : 'hanmadi1234',
    port : 3306,
    database : 'politician'
})

module.exports = pool;