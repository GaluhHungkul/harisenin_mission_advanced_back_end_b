const db = require("../db")

//? CREATE    

const addMovie = async (req, res) => {
    try {
        const { title, year, genre } = req.body;
        const sql = "INSERT INTO movies (title, year, genre) VALUES (?, ?, ?)";
        const [result] = await db.execute(sql, [title, year, genre])
        res.status(201).json({ message : "Data movie telah ditambahkan", movieId : result.insertId })

    } catch (error) {
        res.status(500).json({ message : "Terjadi kesalahan di sisi server" })
    }
}

//? READ

const getAllMovie = async (req,res) => {
    try {
        const { search, genre, sort_by, order } = req.query
        let sql = "SELECT * FROM movies WHERE 1=1"
        let params = []
        if(search) {
            sql += " AND title LIKE ?"
            params.push(`%${search}%`)
        }
        if(genre) {
            sql += " AND genre = ?"
            params.push(genre)
        }
        if(sort_by) {
            const validOrders = ["DESC", "ASC"];
            const sortOrder = validOrders.includes(order?.toUpperCase()) ? order.toUpperCase() : "ASC"
            sql += ` ORDER BY ${sort_by} ${sortOrder}`
        }
        const [data] = await db.execute(sql, params)
        res.status(201).json({ data })
    } catch (error) {
        res.status(500).json({ message : "Terjadi kesalahan di sisi server" })
    }
    
}

const getMovieById = async (req,res) => {
    const { id } = req.params
    if (isNaN(id)) return res.status(400).json({ message: "ID harus berupa angka" });
    const [data] = await db.execute("SELECT * FROM movies WHERE id = ?", [id])
    res.status(201).json({ data : data[0] })
}

//? UPDATE

const updateMovieById = async (req, res) => {
    const { id } = req.params;
    if (isNaN(id)) return res.status(400).json({ message: "ID harus berupa angka" });
    const { title, year, genre } = req.body;
    const sql = "UPDATE movies set title = ?, year = ?, genre = ? where id = ?";
    const [result] = await db.execute(sql, [title, year, genre])
    if (result.affectedRows === 0) return res.status(404).json({ message: "Movie tidak ditemukan" });
    res.json({ message: "Movie telah diupdate" });
}

//? DELETE

const deleteMovieById = async (req, res) => {
    const { id } = req.params;
    if (isNaN(id)) return res.status(400).json({ message: "ID harus berupa angka" });
    const sql = "DELETE FROM movies WHERE id = ?";
    const [result] = await db.execute(sql, [id])
    if (result.affectedRows === 0) return res.status(404).json({ message: "Movie tidak ditemukan" });
    res.json({ message: "Movie berhasil dihapus", result });
  }

module.exports = { addMovie, getAllMovie, getMovieById, updateMovieById, deleteMovieById }