const mongoose = require("mongoose");
require('dotenv').config(); //import dotenv module

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        console.log("MongoDB connection SUCCESS");
    } catch (error) {
        console.error("MongoDB connection FAIL");
        console.log(error);
    }
}
module.exports = connectDB;