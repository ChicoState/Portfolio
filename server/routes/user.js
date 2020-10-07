const express = require('express');

const userRouter = express.Router();
const passport = require('passport');
const JWT = require('jsonwebtoken');
const User = require('../models/user');
require('dotenv').config();
require('../passport.js');

const signToken = (userID) =>
  JWT.sign(
    {
      iss: `${process.env.SECRET}`,
      sub: userID,
    },
    `${process.env.SECRET}`,
    {
      expiresIn: '1h',
    },
  );

userRouter.post('/register', async (req, res) => {
  const newUser = new User({
    username: req.body.registerUsername,
    password: req.body.registerPassword,
    email: req.body.registerEmail,
    role: 'user',
    first_name: req.body.registerFirstName,
    middle_name: req.body.registerMiddleName,
    last_name: req.body.registerLastName,
  });
  newUser
    .save()
    .then(() =>
      res.send(`User ${req.body.registerUsername} successfully created.`),
    )
    .catch((err) => {
      res.status(400).json(err);
    });
});

userRouter.post(
  '/login',
  passport.authenticate('local', { session: false }),
  (req, res) => {
    if (req.isAuthenticated()) {
      const { _id, username, role } = req.user;
      const token = signToken(_id);
      res.cookie('access_token', token, { httpOnly: true, sameSite: true });
      res.status(200).json({ isAuthenticated: true, user: { username, role } });
    }
  },
);

userRouter.get(
  '/logout',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    res.clearCookie('access_token');
    res.json({ user: { username: '', role: '' }, success: true });
  },
);

userRouter.get(
  '/authenticated',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    res.status(200).json({
      isAuthenticated: true,
      user: {
        username: req.user.username,
        role: req.user.role,
        first_name: req.user.first_name,
        middle_name: req.user.middle_name,
        last_name: req.user.last_name,
      },
    });
  },
);

userRouter.put(
  '/update/info',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    User.findByIdAndUpdate(req.user._id, req.body, (err, user) => {
      if (err) return res.status(500).send(err);
      return res.send(user);
    });
  },
);
userRouter.put(
  '/update/password',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    User.findById(req.user._id, (err, user) => {
      if (err) return res.status(500).send(err);
      user.comparePassword(req.body.old_password, (error, result) => {
        if (error) return res.status(500).send(error);

        if (!result) {
          return res.send('old password does not match password on record!');
        }

        user.password = req.body.new_password;
        user.save();
        return res.send(`Password for ${req.user.username} has been changed!`);
      });
      return user;
    });
  },
);
module.exports = userRouter;
