const jwt = require('jsonwebtoken');
const config = require('config');

// middleware function

module.exports = function (req, res, next) {

  // get token from  the header
  // when we protect the route so we send the token to the header
  // x-auth- token  is basically the key we send along when we send the token

  const token = req.header('x-auth-token');

  // check if not any token

  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  //  verify the token

  try {
    // decode the token 
    const decoded = jwt.verify(token, config.get('jwtSecret'));
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};
