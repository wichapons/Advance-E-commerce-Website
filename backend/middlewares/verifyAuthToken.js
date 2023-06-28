const jwt = require("jsonwebtoken")
const verifyIsLoggedIn = (req, res, next) => {
    try {
        const token = req.cookies.access_token; //jwt token saved in cookie will contains _id, name, lastName, email, isAdmin 
        if(!token) {
           return res.status(403).send("A token is required for authentication");
        }
        try {
           const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
            req.user = decoded;  //_id, name, lastName, email, isAdmin 
            next();
        } catch (err) {
          return res.status(401).send("Unauthorized. Invalid Token"); 
        }

    } catch(err) {
        next(err);
    }
}

const verifyIsAdmin = (req, res, next) => {
    if(req.user && req.user.isAdmin) {
        next();
    } else {
        return res.status(401).send("Unauthorized. Admin permission required");
    }
}


module.exports = { 
    verifyIsLoggedIn:verifyIsLoggedIn,
    verifyIsAdmin:verifyIsAdmin
 }
