require('dotenv').config();
require('../passport.js');
const express = require('express');

const userRouter = express.Router();
const passport = require('passport');
const JWT = require('jsonwebtoken');
const cors = require('cors');
const User = require('../models/user');

userRouter.use(cors());
const signToken = (id, username) =>
  JWT.sign(
    {
      id,
      username,
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
      const token = signToken(_id, username);
      res.cookie('access_token', token, { sameSite: true });
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
        user.save((saveError) => {
          if (saveError) res.send('error saving new password to user doc!');
          return res.send(
            `Password for ${req.user.username} has been changed!`,
          );
        });
        return result;
      });
      return user;
    });
  },
);

userRouter.get(
  '/recommended',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    User.find(
      { _id: { $ne: req.user._id } },
      'username first_name last_name',
      (err, docs) => {
        if (err) res.status(500).send(err);
        const userDocs = docs.filter(
          (user) => !req.user.followed_users.includes(user._id),
        );
        res.send(userDocs);
      },
    );
  },
);

userRouter.post(
  '/follow',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    User.findById(req.user._id, (err, user) => {
      if (err) return res.status(500).send(err);
      if (!user.followed_users.includes(req.body.follow_user_id)) {
        user.followed_users.push(req.body.follow_user_id);
        user.save((saveError) => {
          if (saveError) {
            res
              .status(500)
              .send(`${saveError}Could not save new followed user to database`);
          }
          return res.send(
            `${req.user.username} is now following ${req.body.follow_username}`,
          );
        });
      }
      return user;
    });
  },
);

userRouter.get(
  '/following',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    User.find(
      { _id: { $ne: req.user._id } },
      'username first_name last_name',
      (err, docs) => {
        if (err) {
          res.status(500).send(err);
          console.log(err);
        }
        const userDocs = docs.filter((user) =>
          req.user.followed_users.includes(user._id),
        );
        res.send(userDocs);
      },
    );
  },
);

userRouter.post(
  '/unfollow',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    User.findById(req.user._id, (err, user) => {
      if (err) return res.status(500).send(err);
      if (user.followed_users.includes(req.body.follow_user_id)) {
        user.followed_users.pull(req.body.follow_user_id);
        user.save((saveError) => {
          if (saveError) {
            res
              .status(500)
              .send(`${saveError}Could not unfollow user from database`);
          }
          return res.send(
            `${req.user.username} is now unfollowing ${req.body.follow_username}`,
          );
        });
      }
      return user;
    });
  },
);

module.exports = userRouter;
