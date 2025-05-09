const express = require("express")
const router = express.Router()
const upload = require("../middleware/multer")

//? Controller
const userController = require("../controllers/userController")

//? Middleware 
const userMiddleware = require("../middleware/usersMiddleware")

router.post("/register", userMiddleware.validateRegisterUserInput, userController.registerUser)
router.post("/login", userMiddleware.validateLoginUserInput , userController.loginUser)
router.get("/verifikasi-email",  userController.verifyUserToken)
router.post("/upload", upload.array("image", 10) , userController.handleUploadImg)


module.exports = router