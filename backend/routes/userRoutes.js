const express = require('express')
const router = express.Router()
const userController = require("../controllers/userController")
const verifyAuthToken = require("../middlewares/verifyAuthToken")

router.post("/register", userController.registerUser)
router.post("/login", userController.loginUser)

// user routes:
router.use(verifyAuthToken.verifyIsLoggedIn);
router.put("/profile", userController.updateUserProfile);
router.get('/profile/:id', userController.getUserProfile)
router.post('/review/:productId', userController.createReview)

// admin routes:
router.use(verifyAuthToken.verifyIsAdmin);
router.get("/", userController.getUsers);
router.get("/:id", userController.getUserById);
router.put('/:id', userController.updateUserById)
router.delete('/:id', userController.deleteUserById)

module.exports = router
