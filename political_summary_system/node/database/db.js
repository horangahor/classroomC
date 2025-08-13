const mysql = require("mysql2/promise");


const pool = mysql.createPool({
    host : '124.60.230.54',
    user : 'hanmadi',
    password : 'hanmadi1234',
    port : 3307,
    database : 'politician'
})

module.exports = pool;