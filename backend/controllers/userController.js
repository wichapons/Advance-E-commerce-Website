const User = require("../models/UserModel");
const Review = require("../models/ReviewModel");
const Product = require("../models/ProductModel");
const { hashPassword, comparePasswords } = require("../utils/hashPassword");
const generateAuthToken = require("../utils/generateAuthToken");
let cookieParams = require("../config/cookieParameter");

const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({}).select("-password"); //exclude password in query result
    return res.json(users);
  } catch (err) {
    next(err);
  }
};

const registerUser = async (req, res, next) => {
  try {
    const { name, lastName, password } = req.body;
    let { email } = req.body;
    if (!(name && lastName && email && password)) {
      return res.status(400).send("All inputs are required");
    }
    email = email.toLowerCase(); //change email to lower case
    const userExists = await User.findOne({ email });
    //check if user exists
    if (userExists) {
      return res.status(400).send({ error: "user already existed" });
    } else {
      const hashedPassword = hashPassword(password);
      //create new user
      const user = await User.create({
        name,
        lastName,
        email: email,
        password: hashedPassword,
      });
      res
        .cookie(
          "access_token",
          generateAuthToken(
            user._id,
            user.name,
            user.lastName,
            user.email,
            user.isAdmin
          ),
          cookieParams
        ) //send cookie to client
        .status(201)
        .json({
          success: "User created",
          userCreated: {
            _id: user._id,
            name: user.name,
            lastName: user.lastName,
            email: user.email,
            isAdmin: user.isAdmin,
          },
        });
    }
  } catch (err) {
    next(err);
  }
};

const loginUser = async (req, res, next) => {
  try {
    const { password, doNotLogout } = req.body;
    let { email } = req.body;
    if (!(email && password)) {
      return res.status(400).send("All inputs are required");
    }
    email = email.toLowerCase(); //change email to lower case

    const user = await User.findOne({ email }).orFail();
    if(!user){
      return res.status(401).send("wrong credentials");
    }
    if (user && await comparePasswords(password, user.password) === true) {
      if (doNotLogout) {
        cookieParams = { ...cookieParams, maxAge: 1000 * 60 * 60 * 24 * 7 }; // set maxAge to 7 days 
      }else{
        cookieParams = { ...cookieParams, maxAge: 1000 * 60 * 60 * 24}; // set maxAge to 24 hr
      }
      return res
        .cookie(
          "access_token",
          generateAuthToken(
            user._id,
            user.name,
            user.lastName,
            user.email,
            user.isAdmin
          ),
          cookieParams
        )
        .json({
          success: "user logged in",
          userLoggedIn: {
            _id: user._id,
            name: user.name,
            lastName: user.lastName,
            email: user.email,
            isAdmin: user.isAdmin,
            doNotLogout,
          },
        });
    } else {
      return res.status(401).send("wrong credentials");
    }
  } catch (err) {
    if(err.message.includes("No document found for query")){
      return res.status(401).send("wrong credentials");
    }
    next(err);
  }
};

const updateUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).orFail();
    user.name = req.body.name || user.name;
    user.lastName = req.body.lastName || user.lastName;
    user.phoneNumber = req.body.phoneNumber;
    user.address = req.body.address;
    user.country = req.body.country;
    user.zipCode = req.body.zipCode;
    user.city = req.body.city;
    user.state = req.body.state;

    //check password match on DB
    if (req.body.password !== user.password) {
      user.password = hashPassword(req.body.password);
    }
    await user.save();

    res.json({
      success: "user updated",
      userUpdated: {
        _id: user._id,
        name: user.name,
        lastName: user.lastName,
        email: user.email,
        isAdmin: user.isAdmin,
      },
    });
  } catch (err) {
    next(err);
  }
};

const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).orFail();
    return res.send(user);
  } catch (err) {
    next(err);
  }
};

const createReview = async (req, res, next) => {
  try {
    const session = await Review.startSession(); //create transactionsal process
    
    // get comment, rating from request.body
    const { comment, rating } = req.body;
    // validate request
    if (!(comment && rating)) {
      return res.status(400).send("All inputs are required");
    }

    // create review id manually because it is needed also for saving in Product collection
    const ObjectId = require("mongodb").ObjectId;
    let reviewId = new ObjectId();
    
    session.startTransaction(); //begin transaction process here if something error everything will revert
    await Review.create([
      {
        _id: reviewId,
        comment: comment,
        rating: parseInt(rating),
        user: {
          _id: req.user._id,
          name: req.user.name + " " + req.user.lastName,
        },
      },
    ],{session:session});//add transaction process
    
    const product = await Product.findById(req.params.productId)
    .populate("reviews")
    .session(session); //add transaction process

    //Check if this user already reviewed this product
    const isReviewed = product.reviews.some((item) => { // .some will return boolean based on conditions
      if (item.user._id.toString() === req.user._id.toString()) {
        return true;
      } else {
        return false;
      }
    });
    if (isReviewed) {
      await  session.abortTransaction(); // abort the transaction process revert everyback to initial state
      session.endSession(); //release the server resource
      return (res
        .status(400)
        .json({ message: "You already reviewed this product!" }));
    }

    let productReviewDoc = [...product.reviews];

    //productReviewDoc.push({ rating: rating });
    product.reviews.push(reviewId); //push new review to the product doc

    if (product.reviews.length === 1) {
      //in case of no review exists
      product.rating = Number(rating);
      product.reviewsNumber = 1;
    } else {
      //if already has reviews
      product.reviewsNumber = product.reviews.length;
      // Calculate the sum of ratings
      const totalRatings = productReviewDoc
        .map((item) => {
          return Number(item.rating);
        })
        .reduce((sum, item) => {
          return sum + item;
        }, 0);

      // Calculate the average rating
      const averageRating = totalRatings / product.reviews.length;
      const roundedAverageRating = Math.round(averageRating)

      // Update the product's rating with the average
      product.rating = roundedAverageRating;
    }
    await product.save();
    await session.commitTransaction();//comfirm transaction no revert will occure

    session.endSession();
    res.json("review created");
  } catch (err) {
    next(err);
  }
};

const getUserById = async (req, res, next) => {
  try {
      const user = await User.findById(req.params.id).select("name lastName email isAdmin").orFail();
      return res.send(user);
  } catch (err) {
     next(err); 
  }
}

const updateUserById = async (req, res, next) => {
  try {
      const user = await User.findById(req.params.id).orFail();   
      user.name = req.body.name || user.name;
      user.lastName = req.body.lastName || user.lastName;
      user.email = req.body.email || user.email;
      user.isAdmin = req.body.isAdmin

      await user.save();

      res.send("user updated");

  } catch (err) {
     next(err); 
  }
}

const deleteUserById = async (req, res, next) => {
  try {
     const user = await User.findById(req.params.id).orFail();
     await user.deleteOne(); 
     res.status(200).send("user removed");
  } catch (err) {
      next(err);
  }
}

module.exports = {
  getUsers: getUsers,
  registerUser: registerUser,
  loginUser: loginUser,
  updateUserProfile: updateUserProfile,
  getUserProfile: getUserProfile,
  createReview: createReview,
  getUserById:getUserById,
  updateUserById:updateUserById,
  deleteUserById:deleteUserById
};
