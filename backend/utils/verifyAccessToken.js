const jwt = require("jsonwebtoken");

const verifyAccessToken = (req,res)=>{
    try {
        const cookie = req.cookies;
        // Extract the access token from the cookies
        const accessToken = cookie.access_token;
        // Verify the access token using the JWT secret key
        const decoded = jwt.verify(accessToken, process.env.JWT_SECRET_KEY);
        // If the token is valid, send the decoded token data as JSON response
        return res.json({ token: decoded.name, isAdmin: decoded.isAdmin });
    } catch (err) {
        // If there's an error (invalid token or verification fails), send 401 Unauthorized status
        return res.status(401).send("Unauthorized. Invalid Token");
    }
}

module.exports = verifyAccessToken