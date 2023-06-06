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

app.use("/api", apiRoutes);

app.use((error, req, res, next) => {
  res.status(500).json({
    message: error.message,
    stack: error.stack,
  });
});

//Database connection
connectDB();

app.listen(port, () => {
  console.log(`Server started successfully on port ${process.env.PORT}`)
})
