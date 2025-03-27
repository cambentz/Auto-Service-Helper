const jwt = require('jsonwebtoken'); 
require('dotenv').config(); 

/**
 * Middleware to authenticate JWT tokens.
 * Extracts token from the Authorization header, verifies it, and attaches user data to the request.
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {function} next - Express next function to pass control to the next middleware.
 */
const authenticateToken = (req, res, next) => {
    // Extrack token from Authorization header
    const token = req.header('Authorization');
    if (!token) 
        return res.status(401).json({ message: 'Access denied' });

    // Verify token validity
    jwt.verify(token, process.env.JWT_SECRET, (err, user) =>{
        if (err)
            return res.status(403).json({ message: 'Invalid token'});

        // Attach user details to the request object
        req.user = user;
        next(); 
    });
};


// Export middleware function(s)
module.exports = {
    authenticateToken
}