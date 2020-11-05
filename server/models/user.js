const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const beautifyUnique = require('mongoose-beautiful-unique-validation');

const UserSchema = mongoose.Schema({
  username: {
    type: String,
    required: [true, "can't be blank"],
    unique: [true, 'username ({VALUE}) is already taken'],
    match: [/^[a-zA-Z0-9]+$/, 'is invalid'],
    index: true,
    min: 3,
    max: 15,
  },
  email: {
    type: String,
    required: [true, "can't be blank"],
    unique: [true, 'already taken'],
    match: [/\S+@\S+\.\S+/, 'is invalid'],
    index: true,
    max: 1024,
  },
  password: {
    type: String,
    required: [true, "can't be blank"],
    min: 8,
    max: 1024,
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    required: true,
  },
  first_name: {
    type: String,
    match: [/^[a-zA-Z]+$/, 'is invalid'],
    index: true,
    max: 1024,
  },
  middle_name: {
    type: String,
    match: [/^[a-zA-Z]+$/, 'is invalid'],
    index: true,
    max: 1024,
  },
  last_name: {
    type: String,
    match: [/^[a-zA-Z]+$/, 'is invalid'],
    index: true,
    max: 1024,
  },
  followed_users: {
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
});

UserSchema.plugin(beautifyUnique);

UserSchema.pre('save', function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  return bcrypt.hash(this.password, 10, (err, passwordHash) => {
    if (err) {
      return next(err);
    }
    this.password = passwordHash;
    return next();
  });
});

UserSchema.methods.comparePassword = function (password, cb) {
  bcrypt.compare(password, this.password, (err, isMatch) => {
    if (err) {
      return cb(err);
    }
    if (!isMatch) {
      return cb(null, isMatch, { message: 'Invalid password' });
    }
    return cb(null, this);
  });
};

module.exports = mongoose.model('User', UserSchema);
