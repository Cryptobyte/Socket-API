const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Sign up for a new user account with the given data
 * 
 * @param {*} data { username: string, password: string }
 * @returns {Object} { token: string } or error
 */
exports.signup = async(data) => {
  if ((!data.username) || (!data.password)) {
    return { error: 'Missing username or password' };
  }

  try {
    const _user = new User({
      username: data.username,
      password: data.password
    });

    const user = await _user.save();
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    return {
      token: token
    }

  } catch (err) {
    return { error: err.message };
  }
};

/**
 * Sign in to an existing user account with the given data
 * 
 * @param {*} data { username: string, password: string }
 * @returns {Object} { token: string } or error
 */
exports.signin = async(data) => {
  if ((!data.username) || (!data.password)) {
    return { error: 'Missing username or password' };
  }

  let message;

  try {
    const user = await User.findOne({ username: data.username });

    await user.verifyPass(data.password, (err, match) => {
      if (err) {
        message = { error: err.message };
        return;
      }

      if (!match) {
        message = { error: 'Invalid username or password' };
        return;
      }

      const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

      message = { token: token };
    });

    return message;

  } catch (err) {
    return { error: err.message };
  }
};