const mysql = require("mysql2/promise");
const dotenv = require("dotenv");
dotenv.config();
const { DB_IP, DB_USER, DB_PORT, DB_PASSWORD, DB_DATABASE } = process.env;

const pool = mysql.createPool({
    host : DB_IP, // db 
    user : DB_USER,
    password : DB_PASSWORD,
    port : DB_PORT,
    database : DB_DATABASE
})

module.exports = pool;