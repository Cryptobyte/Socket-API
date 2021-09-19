const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Fetch data with a valid JWT this is an example of how to 
 * limit access to authenticated users. We simply use their 
 * user ID that's been stored in the JWT
 * 
 * @param {*} data Requires token field with a valid token
 * @returns {Object} { message: string } or error
 */
exports.getData = async(data) => {
  if (!data.token) return { error: 'No token provided' };

  let _user;

  try {
    _user = jwt.verify(data.token, process.env.JWT_SECRET);

  } catch(err) {
    return { error: err.message };
  }

  const user = await User.findById(_user._id);

  return { message: `Authenticated as ${user.username}!` };
};