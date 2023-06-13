const express = require('express')
const router = express.Router()
const productController = require('../controllers/productController')
const verifyAuthToken = require("../middlewares/verifyAuthToken")

//Product routes
router.get("/",productController.getProducts)
router.get("/category/:categoryName", productController.getProducts)
router.get("/search/:searchTextQuery", productController.getProducts)
router.get("/category/:categoryName/search/:searchTextQuery", productController.getProducts)
router.get("/bestsellers", productController.getBestsellers)
router.get("/get-one/:id", productController.getProductById)

// admin routes
router.use(verifyAuthToken.verifyIsLoggedIn)
router.use(verifyAuthToken.verifyIsAdmin)
router.get("/admin", productController.adminGetProducts)
router.delete("/admin/delete/:id", productController.adminDeleteProduct)
router.delete("/admin/image/:imagePath/:productId", productController.adminDeleteProductImage)
router.post("/admin/create", productController.adminCreateProduct)
router.put("/admin/update/:id", productController.adminUpdateProduct)
router.post("/admin/upload", productController.adminUpload)

module.exports = router
