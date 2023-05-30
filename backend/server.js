//Express.js
const express = require('express')
const app = express()
//Database 
const mongoose = require('mongoose')
const connectDB = require('./config/db')
//Model
const Product = require('./models/ProductModel')

//config
require('dotenv').config();


const port = 5000

const apiRoutes = require("./routes/apiRoutes")

app.get('/',async (req, res,next) => {
  try{
    const product = new Product;
    product.name = "PC";
    await product.save();
    const products = await Product.find();
    res.send(`product has been create for ${products.length} ${product.id}`)
  }catch(err){
    next(err)
  }
})

app.use('/api', apiRoutes)

//Database connection
connectDB();

app.listen(port, () => {
  console.log(`Server started successfully on port ${process.env.PORT}`)
})
