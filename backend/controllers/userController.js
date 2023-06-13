const User = require("../models/UserModel");
const { hashPassword } = require("../utils/hashPassword");
const generateAuthToken = require("../utils/generateAuthToken");


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
      email = email.toLowerCase();
      const userExists = await User.findOne({email});
      console.log("userExists = ",userExists);
      //check if user exists
      if (userExists) {
        return res.status(400).send({ error: "user already existed" });
      } else {

        const hashedPassword =  hashPassword(password)
        //create new user
        const user = await User.create({
          name,
          lastName,
          email: email.toLowerCase(),//change email to lower case
          password: hashedPassword
        });
        res
        .cookie("access_token", generateAuthToken(user._id, user.name, user.lastName, user.email, user.isAdmin), { //send cookie to client
            //cookie parameter
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict"
      })
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

module.exports = {
    getUsers:getUsers,
    registerUser:registerUser
}
