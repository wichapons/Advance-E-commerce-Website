const jwt = require("jsonwebtoken");

const generateAuthToken = (_id, name, lastName, email, isAdmin) => {
  return jwt.sign(
    { _id, name, lastName, email, isAdmin },
    process.env.JWT_SECRET_KEY,
    { expiresIn: "24h" }//set expired token date
  );
};
module.exports = generateAuthToken
