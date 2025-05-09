<<<<<<< HEAD
const mysql = require("mysql2")

const rawDataTableMovies = [
    { "id": 1, "title": "Inception", "genre": "Sci-Fi", "year": 2010 },
    { "id": 2, "title": "The Dark Knight", "genre": "Action", "year": 2008 },
    { "id": 3, "title": "Interstellar", "genre": "Sci-Fi", "year": 2014 },
    { "id": 4, "title": "Parasite", "genre": "Thriller", "year": 2019 },
    { "id": 5, "title": "The Matrix", "genre": "Sci-Fi", "year": 1999 },
    { "id": 6, "title": "Forrest Gump", "genre": "Drama", "year": 1994 },
    { "id": 7, "title": "Avengers: Endgame", "genre": "Action", "year": 2019 },
    { "id": 8, "title": "Whiplash", "genre": "Drama", "year": 2014 },
    { "id": 9, "title": "Spirited Away", "genre": "Animation", "year": 2001 },
    { "id": 10, "title": "The Godfather", "genre": "Crime", "year": 1972 }
]

const valuesTableMovies = rawDataTableMovies.map(({title, year, genre}) => [title, year, genre])

const db = mysql.createConnection({
=======
const mysql = require("mysql2/promise")


const db = mysql.createPool({
>>>>>>> feat/controller-recovery
    host : "localhost",
    user : "root",
    password : "",
    database : "chill_movies"
})

<<<<<<< HEAD
db.connect((err) => {
    if(err) throw err;
    console.log("MySQL connected")

    const createDbQuery = "CREATE DATABASE IF NOT EXISTS chill_movies";
    db.query(createDbQuery, (error, result) => {
        if(error) {
            console.log("Error membuat database : " , error)
            return
        }
        console.log("Database 'chill_movies' sudah ada/berhasil dibuat")

        createTable()
    })
})

module.exports = db;

const createTable = (namaTable="movies") => {
    const queryTable = `CREATE TABLE IF NOT EXISTS ${namaTable} (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    year INT NOT NULL,
    genre VARCHAR(100) NOT NULL
    )`;
    db.query(queryTable, (error, result) => {
        if(error) {
            console.log("Error membuat table : " , error)
            return
        } 
        console.log(`Table ${namaTable} sudah ada/berhasil dibuat`)       

        checkAndSeed(namaTable)
    })
}

const checkAndSeed = (namaTable) => {
    const sql = "SELECT COUNT(*) as count FROM movies"
    db.query(sql, (error, result) => {

        if(error) return console.log("Error : " , error)
        if(result[0].count !== 0) return console.log("Data sudah ada")  

        const queryData = `INSERT INTO ${namaTable} (title, year, genre) VALUES ?`;
        db.query(queryData, [valuesTableMovies], (error, result) => {
            let msg;
            if(error) msg =  `Gagal memasukkan data : ${error}`
            else msg = `${result.affectedRows} data berhasil ditambahkan`
            console.log(msg)
        })
    })
}
=======
module.exports = db;

>>>>>>> feat/controller-recovery
