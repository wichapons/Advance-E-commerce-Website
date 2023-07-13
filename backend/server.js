//Config
require("dotenv").config();
//Express.js
const express = require("express");
const app = express();
//Database
const connectDB = require("./config/db");
//Database connection
connectDB();
//Routes
const apiRoutes = require("./routes/apiRoutes");
//Express file upload
const fileUpload = require("express-fileupload");
//Cookie
const cookieParser = require("cookie-parser");
//socket.io
const http = require('http');
const configureSocketIO = require("./middlewares/socket")
const httpServer = http.createServer(app);
global.io = configureSocketIO(httpServer);
//error handler
const errorHandler = require("./middlewares/errorHandler")

app.use(errorHandler)
app.use(fileUpload());
app.use(cookieParser());
app.use(express.json());

app.use("/api", apiRoutes);


//Start server
/*
app.listen(process.env.PORT, () => {
  console.log(`Server started successfully on port ${process.env.PORT}`)
})*/

//start server with socket.io
httpServer.listen(process.env.PORT, () =>
  console.log(`Server running on port ${process.env.PORT}`)
);
