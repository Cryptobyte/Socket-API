const mongoose = require('mongoose');
const argon2 = require('argon2');

const user = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  }
});

/**
 * Hash the password before saving if the password field 
 * has been modified, we handle it here so that we don't 
 * have to manually hash the password in every call that 
 * it's being modified at in the handlers
 */
user.pre('save', async function(next) {
  let user = this;

  if (!user.isModified('password')) return next();

  try {
    const hash = await argon2.hash(user.password);
    user.password = hash;
    next();

  } catch (err) {
    return next(err);
  }
});

/**
 * Verifies that a given plain text password matches the
 * hashed password stored in the database
 * 
 * @param {*} password plain text password to verify
 * @param {*} cb err, isMatch
 */
user.methods.verifyPass = async function(password, cb) {
  try {
    const match = await argon2.verify(this.password, password);
    cb(null, match);

  } catch (err) {
    return cb(err);
  }
};

user.post('save', function(err, doc, next) {
  // Add some error handling to make the error more user friendly
  // 11000 is a duplicate key error
  // keyPattern.field is set to 1 to show the field where the error occurred
  if ((err.code === 11000) && (err.keyPattern.username === 1)) {
    next(new Error('Username already in use'));

  } else {
    next(error);
  }
});

module.exports = mongoose.model('User', user);