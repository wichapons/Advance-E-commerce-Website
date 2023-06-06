const express = require('express')
const router = express.Router()
const categoryController = require("../controllers/categoryController")

router.get("/", categoryController.getCategories)
router.post("/", categoryController.newCategory)
router.post("/attr", categoryController.saveAttr)
router.delete("/:category", categoryController.deleteCategory)

module.exports = router
