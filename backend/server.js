//Express.js
const express = require('express')
const app = express()
//Database 
const mongoose = require('mongoose')
const connectDB = require('./config/db')
//Model

//config
require('dotenv').config();


const port = 5000

const apiRoutes = require("./routes/apiRoutes")

app.get('/', (req, res) => {

    res.json({message: "API running..."})
})

app.use('/api', apiRoutes)

//Database connection
connectDB();

app.listen(port, () => {
  console.log(`Server started successfully on port ${process.env.PORT}`)
})
