require("dotenv").config()
const jwt = require("jsonwebtoken")

const validateRegisterUserInput = (req,res,next) => {
    if(!req.body) return res.status(400).json({ message : "Request body tidak ditemukan" })
    const { fullname, username, email, password } = req.body
    if(!fullname || !username || !email || !password) return res.status(400).json({ message : "Data tidak lengkap" })
    next()
}

const validateLoginUserInput = (req,res,next) => {
    if(!req.body) return res.status(400).json({ message : "Request body tidak ditemukan" })
    const { email, password } = req.body
    if(!email || !password) return res.status(400).json({ message : "Data tidak lengkap" })
    next()
}

const verifyToken =  (req,res,next)  => {
    const { authorization } = req.headers
    if(!authorization || !authorization.startsWith("Bearer ")) return res.status(401).json({ message : "Unauthorized" })
    const token = authorization.split(" ")[1]
    try {
        const decoded =  jwt.verify(token, process.env.JWT_KEY)
        req.user = decoded
        next()
    } catch (error) {
        res.status(500).json({ message : "Terjadi kesalahan di sisi server", error : error.message })
    }
}


module.exports = { validateRegisterUserInput, verifyToken, validateLoginUserInput }