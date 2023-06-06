const Product = require("../models/ProductModel")

const getProducts = (req, res) => {
    const product = new Product;
    product.name = "Topazio"
    res.send("Handling product routes, e.g. search for products")
}
module.exports = {
    getProducts:getProducts
}
