const express = require('express')
const router = express.Router()
const userController = require("../controllers/userController")

// user logged in routes:
router.post("/register", userController.registerUser)
router.post("/login", userController.loginUser)

// admin routes:
router.get("/", userController.getUsers)


module.exports = router
