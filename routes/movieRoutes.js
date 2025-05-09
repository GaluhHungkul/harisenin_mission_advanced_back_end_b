const express = require("express");
const router = express.Router();

//! Controller
const movieController = require("../controllers/movieController")

//! Middleware
const movieMiddleware = require("../middleware/moviesMiddleware")
const userMiddleware = require("../middleware/usersMiddleware")


//? CREATE

router.post("/", movieMiddleware.validateMovieInput, movieController.addMovie);

//? READ

router.get("/", userMiddleware.verifyToken ,movieController.getAllMovie);

router.get("/:id", userMiddleware.verifyToken ,movieController.getMovieById);

//? UPDATE

router.put("/:id", userMiddleware.verifyToken ,movieMiddleware.validateMovieInput, movieController.updateMovieById);

//? DELETE

router.delete("/:id", userMiddleware.verifyToken ,movieController.deleteMovieById);

module.exports = router