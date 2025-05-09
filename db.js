const mysql = require("mysql2/promise")


const db = mysql.createPool({
    host : "localhost",
    user : "root",
    password : "",
    database : "chill_movies"
})

module.exports = db;

