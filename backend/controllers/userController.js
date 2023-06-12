const User = require("../models/UserModel");
const { hashPassword } = require("../utils/hashPassword");


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
      const { name, lastName, email, password } = req.body;
      if (!(name && lastName && email && password)) {
        return res.status(400).send("All inputs are required");
      }
  
      const userExists = await User.findOne({ email });
      //check if user exists
      if (userExists) {
        return res.status(400).json({ error: "user already existed" });
      } else {

        const hashedPassword =  hashPassword(password)
        //create new user
        const user = await User.create({
          name,
          lastName,
          email: email.toLowerCase(),//change email to lower case
          password: hashedPassword
        });
        res.status(201).send(user); 
      }
    } catch (err) {
      next(err);
    }
  };

module.exports = {
    getUsers:getUsers,
    registerUser:registerUser
}
