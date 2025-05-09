<<<<<<< HEAD
const express = require("express")
const cors = require("cors")
const app = express()
const db = require("./db")
const validateMovieInput = require("./middleware/validateMovieInput")

app.use(cors())
app.use(express.json())

//? CREATE

app.post("/movies", validateMovieInput,  (req,res) => {
    const { title, year, genre } = req.body
    const sql = 'INSERT INTO movies (title, year, genre) VALUES (?, ?, ?)';
    db.query(sql, [title, year, genre], (error, result) => {
        if(error) return res.status(500).json({error})
        res.json({
            data : {
                id : result.insertId, title, year, genre
            },
            message : "Data berhasil ditambahkan"
        })
    })
})

//? READ

app.get("/movies", (req,res) => {
    db.query("SELECT * FROM movies", (error, results) => {
        if(error) return res.status(500).json({ error })
        res.json(results)
    })
})

app.get("/movies/:id", (req,res) => {
    const { id } = req.params
    if(isNaN(id))  return res.status(400).json({ message : "ID harus berupa angka" })
    const sql = "SELECT * FROM movies WHERE id = ?";
    db.query(sql, [id],(error, result) => {
        if(error) return res.status(500).json({ error })
        if(!result.length) res.status(404).json({ message : "Movie tidak ditemukan" })
        else res.json(result)
    })
})

//? UPDATE

app.put("/movies/:id", validateMovieInput, (req,res) => {
    const { id } = req.params
    if(isNaN(id))  return res.status(400).json({ message : "ID harus berupa angka" })
    const { title, year, genre } = req.body
    const sql = "UPDATE movies set title = ?, year = ?, genre = ? where id = ?";
    db.query(sql, [title, year, genre, id], (error, result) => {
        if(error) return res.status(500).json({ error })
        if (result.affectedRows === 0)  return res.status(404).json({ message: "Movie tidak ditemukan" });    
        res.json({ message : "Movie telah diupdate" })
    })
})

//? DELETE

app.delete("/movies/:id", (req,res) => {
    const { id } = req.params
    if(isNaN(id))  return res.status(400).json({ message : "ID harus berupa angka" })
    const sql = "DELETE FROM movies WHERE id = ?"
    db.query(sql, [id], (error, result) => {
        if(error) return res.status(500).json({ error })
        if (result.affectedRows === 0)  return res.status(404).json({ message: "Movie tidak ditemukan" });    
        res.json({ message : "Movie berhasil dihapus", result })
    })
})
=======
require("dotenv").config()
const express = require("express")
const cors = require("cors")
const path = require("path")

const app = express()

const userRoutes = require("./routes/userRoute")
const movieRoutes = require("./routes/movieRoutes")

const allowedOrigin = ["http://localhost:5173"]

app.use(cors({
    origin : (origin, callback) => {        
        if(allowedOrigin.includes(origin)) {
            callback(null, true)
        }
        else {
            callback(new Error("Not Allowed by CORS"))
        }
    }
}))

app.use(express.urlencoded({ extended : true }))
app.use(express.json())
app.use("/users", userRoutes)
app.use("/movies", movieRoutes)
app.use("/uploads", express.static(path.join(__dirname, "uploads")))
>>>>>>> feat/controller-recovery

app.use((req, res, next) => {
    res.status(404).json({ message : "Route tidak ditemukan" })
})

app.listen(2999, () => {
    console.log("Listen to http://localhost:2999")
})