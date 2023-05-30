const express = require("express")
const app = express()
const productRoutes = require("./product-route")

app.use("/products", productRoutes)

module.exports = app
