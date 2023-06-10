const express = require('express')
const router = express.Router()
const productController = require('../controllers/productController')

router.get("/",productController.getProducts)
router.get("/category/:categoryName", productController.getProducts)
router.get("/search/:searchTextQuery", productController.getProducts)
router.get("/category/:categoryName/search/:searchTextQuery", productController.getProducts)

module.exports = router
