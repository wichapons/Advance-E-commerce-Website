const express = require('express')
const router = express.Router()
const productController = require('../controllers/productController')

router.get("/category/:categoryName", productController.getProducts)
router.get("/",productController.getProducts)

module.exports = router
