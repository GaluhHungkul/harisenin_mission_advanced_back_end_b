require("dotenv").config()
const db = require("../db")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const nodemailer = require("nodemailer")
const { v4 : uuidv4 } = require("uuid")

const handleSendMailVerification = async ({verificationToken, email}) => {
    const transporter = nodemailer.createTransport({
        service : "gmail",
        auth : {
            user : process.env.EMAIL_SENDER,
            pass : process.env.EMAIL_APP_PASS
        }
    })
    const verifyUrl = `http://localhost:2999/users/verifikasi-email?token=${verificationToken}`
    await transporter.sendMail({
        from : `"Chill Movie" <${process.env.EMAIL_SENDER}>`,
        to : email,
        subject : "Verifikasi Akun",
        html : `<p>Silakan klik link berikut untuk verifikasi akun kamu : <a href="${verifyUrl}">Verifikasi</a></p>`
    })
}

const registerUser = async (req,res) => {
    try {
        const { fullname, username, email, password } = req.body
        const [rows] = await db.execute("SELECT * FROM users WHERE email = ?", [email])
        if(rows.length) return res.status(409).json({ message : "Email sudah digunakan" })
        const hashedPassword = await bcrypt.hash(password, 10)
        const verificationToken = uuidv4()
        await db.execute("INSERT INTO users (fullname, username, email, password, verification_token, is_verified) VALUES (?, ?, ?, ?, ?, ?)", [fullname, username, email, hashedPassword, verificationToken, false])
        await handleSendMailVerification({verificationToken, email})
        res.status(201).json({ message : "Register berhasil, silakan cek email untuk verifikasi" })
    } catch (error) {
        res.status(500).json({ message : "Terjadi kesalahan di sisi server", error : error.message })
        console.log({ error })
    }
}

const loginUser = async (req,res)  => {
    try {
        const { email, password } = req.body
        const [user] = await db.execute("SELECT * FROM users WHERE email = ?", [email])
        if(!user.length) return res.status(404).json({ message : "Email pengguna tidak ditemukan" })
        
        const isMatch = await bcrypt.compare(password, user[0].password)
        if(!isMatch) return res.status(400).json({ message : "Password salah" })

        if(!user[0].is_verified) return res.status(400).json({ message : "Akun belum diverifikasi. Silakan cek email anda" })
        
        const payload = {
            userId : user[0].id,
            email : user[0].email
        }
        const token =  jwt.sign(payload, process.env.JWT_KEY, { expiresIn : "1h" })    
        res.status(201).json({ token })   

    } catch (error) {
        res.status(500).json({ message : "Terjadi kesalahan di sisi server", error : error.message })
        console.log({ error })
    }
}

const verifyUserToken = async (req,res) => {
    try {
        const { token } = req.query
        if(!token) return res.status(400).json({ message : "Token tidak ditemukan" })

        const [rows] = await db.execute("SELECT * FROM users WHERE verification_token = ?", [token])
        if(!rows.length) return res.status(400).json({ message : "Token tidak valid atau akun sudah diverifikasi" })

        await db.execute("UPDATE users SET is_verified = ?, verification_token = NULL WHERE verification_token = ?", [true, token])
        res.send(
        `
            <h1 style="text-align: center; height : 100vh; align-content : center; font-family : sans-serif; margin : 0; padding : 0">Verifikasi berhasil</h1>    
        `)
    } catch (error) {
        console.log({error})
        res.status(500).json({ message : "Terjadi kesalahan di sisi server" })
    }

}

const handleUploadImg = async (req,res) => {
    try {
        const file = req.file; 
        if (!file) return res.status(400).json({ message: "Tidak ada file yang diupload" });
        const fileInfo = {
          filename: file.filename,
          url: `${req.protocol}://${req.get("host")}/uploads/${file.filename}`,
        };
        res.status(200).json({ message : "File berhasil diupload", file : fileInfo })
    } catch (error) {
        console.log({error})
        res.status(500).json({ message : "Terjadi kesalahan di sisi server" })
    }
}


module.exports = { registerUser, loginUser, verifyUserToken, handleUploadImg }