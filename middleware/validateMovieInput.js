const validateMovieInput = (req, res, next) => {   
    if(!req.body) return res.status(400).json({ message : "Request body tidak ditemukan" })
    const { title, year, genre } = req.body
    if(!title || !year || !genre) return res.status(400).json({ message : "Data tidak lengkap" })
    else next()
}

module.exports = validateMovieInput