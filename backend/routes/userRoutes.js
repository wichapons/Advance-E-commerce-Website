const express = require('express')
const router = express.Router()
const userController = require("../controllers/userController")
const verifyAuthToken = require("../middlewares/verifyAuthToken")

router.post("/register", userController.registerUser)
router.post("/login", userController.loginUser)

// user routes:
router.use(verifyAuthToken.verifyIsLoggedIn);
router.put("/profile", userController.updateUserProfile);

// admin routes:
router.use(verifyAuthToken.verifyIsAdmin);
router.get("/", userController.getUsers)


module.exports = router
