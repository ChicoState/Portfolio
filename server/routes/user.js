const express = require('express');

const userRouter = express.Router();
const passport = require('passport');
const JWT = require('jsonwebtoken');
const User = require('../models/user');
require('dotenv').config();

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
    const { username, role } = req.user;
    res.status(200).json({ isAuthenticated: true, user: { username, role } });
  },
);

module.exports = userRouter;
