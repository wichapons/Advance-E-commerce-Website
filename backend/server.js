//Config
require('dotenv').config();
//Express.js
const express = require('express')
const app = express()
//Database 
const mongoose = require('mongoose')
const connectDB = require('./config/db')
//Database connection
connectDB();
//Model
const Product = require('./models/ProductModel')
//Routes
const apiRoutes = require("./routes/apiRoutes")
//Express file upload
const fileUpload = require("express-fileupload")

app.use(fileUpload())

app.use(express.json());

app.use("/api", apiRoutes);

//Error handling
app.use((error, req, res, next) => {
  const response = {
    message: error.message
  };
  //send the detailed error when in dev mode ONLY
  if (process.env.NODE_ENV === 'dev'){
    response.stack = error.stack;
  }
  //console.log(error);
  res.status(500).json(response);
  return;
});

//Start server
app.listen(process.env.PORT, () => {
  console.log(`Server started successfully on port ${process.env.PORT}`)
})
