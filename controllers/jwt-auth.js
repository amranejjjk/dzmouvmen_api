const jwt = require('jsonwebtoken');
require('dotenv').config();
// Middleware function for JWT authentication
function authenticateJWT(req, res, next) {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized - Token missing' });
  }

  try {
    
    // Verify the JWT token
    const decoded = jwt.verify(token,  process.env.JWT_SECRET);
   
    
    // Attach the decoded token to the request object for later use
    req.user = decoded;

    next(); // Move to the next middleware or route handler
  } catch (error) {
    console.error('Error authenticating JWT:', error);
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Unauthorized - Invalid token' });
    } else {
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
}

module.exports = authenticateJWT;
