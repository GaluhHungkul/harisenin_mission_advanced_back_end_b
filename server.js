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

app.use((req, res, next) => {
    res.status(404).json({ message : "Route tidak ditemukan" })
})

app.listen(2999, () => {
    console.log("Listen to http://localhost:2999")
})