//connect to DB
const connectDB = require("../config/db");
connectDB();
//import model
const Category = require("../models/CategoryModel");
const Product = require("../models/ProductModel");
const Review = require("../models/ReviewModel");
const User = require("../models/UserModel");
const Order= require("../models/OrderModel");

//import seeder data
const categoryData = require("./categories");
const productData = require("./products");
const reviewData  = require("./reviews");
const userData = require("./user");
const orderData = require("./order")



const importData = async () => {
    try {
        //delete current indexes
        await Category.collection.dropIndexes()
        await Product.collection.dropIndexes()
        await Review.collection.dropIndexes()
        await User.collection.dropIndexes()
        await Order.collection.dropIndexes()

        //delete all data in each schema
        await Category.collection.deleteMany({})   
        await Product.collection.deleteMany({}) 
        await Review.collection.deleteMany({})
        await User.collection.deleteMany({})
        await Order.collection.deleteMany({})
      
        const reviews = await Review.insertMany(reviewData);
        //merge userid in review to product db
        const sampleProducts = productData.map((product)=>{
            reviews.map((review)=>{
                product.reviews.push(review._id)
            })
            return {...product} //return as an array of product
        })

        //insert data to each schema
        await Product.insertMany(sampleProducts)
        await Category.insertMany(categoryData)
        await User.insertMany(userData)
        await Review.insertMany(reviewData)
        await Order.insertMany(orderData)

        console.log("Seeder data proceeded successfully")
        process.exit()
    } catch (error) {
        console.error("Error while proccessing seeder data", error)
        process.exit(1);
    }
}

importData();
 
