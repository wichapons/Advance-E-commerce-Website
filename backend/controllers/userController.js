const User = require("../models/UserModel");
const { hashPassword,comparePasswords } = require("../utils/hashPassword");
const generateAuthToken = require("../utils/generateAuthToken");
let cookieParams = require("../config/cookieParameter")


const getUsers = async (req, res, next) => {
    try {
        const users = await User.find({}).select("-password"); //exclude password in query result
        return res.json(users);
    } catch (err) {
        next(err);
    }
}

const registerUser = async (req, res, next) => {
    try {
      const { name, lastName, password } = req.body;
      let{email} = req.body;
      if (!(name && lastName && email && password)) {
        return res.status(400).send("All inputs are required");
      }
      email = email.toLowerCase(); //change email to lower case
      const userExists = await User.findOne({email});
      console.log("userExists = ",userExists);
      //check if user exists
      if (userExists) {
        return res.status(400).send({ error: "user already existed" });
      } else {
        const hashedPassword =  hashPassword(password);
        //create new user
        const user = await User.create({
          name,
          lastName,
          email: email,
          password: hashedPassword
        });
        res
        .cookie("access_token", generateAuthToken(user._id, user.name, user.lastName, user.email, user.isAdmin), cookieParams  )  //send cookie to client
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
      const {password, doNotLogout } = req.body;
      let {email}=req.body;
      if (!(email && password)) {
        return res.status(400).send("All inputs are required");
      }
      email = email.toLowerCase(); //change email to lower case
      const user = await User.findOne({ email });
      if (user && comparePasswords(password, user.password)) {
        if (doNotLogout) {
          cookieParams = { ...cookieParams, maxAge: 1000 * 60 * 60 * 24 * 7 }; // 1000=1ms
        }
        return res.cookie(
          "access_token",
          generateAuthToken(
            user._id,
            user.name,
            user.lastName,
            user.email,
            user.isAdmin
          ),
          cookieParams
        ).json({
            success: "user logged in",
            userLoggedIn: { _id: user._id, name: user.name, lastName: user.lastName, email: user.email, isAdmin: user.isAdmin, doNotLogout }
        });
      } else {
         return res.status(401).send("wrong credentials") 
      }
    } catch (err) {
      next(err);
    }
  };


module.exports = {
    getUsers:getUsers,
    registerUser:registerUser,
    loginUser:loginUser,
}
