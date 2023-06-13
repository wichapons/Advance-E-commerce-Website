const bcrypt = require("bcrypt");

const salt = bcrypt.genSaltSync(10); //generate salt

const hashPassword = (password) => {
  return bcrypt.hashSync(password, salt); // generate hash
};

const comparePasswords = (inputPassword, hashedPassword) => {
  return bcrypt.compare(inputPassword, hashedPassword);
};

module.exports = { hashPassword,comparePasswords };
