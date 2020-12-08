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
    username: req.body.username,
    password: req.body.password,
    email: req.body.email,
    role: 'user',
    public: true,
    followed_users: [],
    pending_followers: [],
  });
  newUser
    .save()
    .then(() => res.send(`User ${req.body.username} successfully created.`))
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

userRouter.get(
  '/exists/:username',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    User.findOne({ username: req.params.username }, (err, user) => {
      if (err) {
        return res.status(500).json(err);
      }
      return res.json({ exists: !!user });
    });
  },
);

userRouter.put(
  '/update/info',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    User.findByIdAndUpdate(req.user._id, req.body, (err, user) => {
      if (err) return res.status(500).json(err);
      return res.send(user);
    });
  },
);
userRouter.put(
  '/update/password',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    User.findById(req.user._id, (err, user) => {
      if (err) return res.status(500).json(err);
      user.comparePassword(req.body.old_password, (error, result) => {
        if (error) return res.status(500).json(error);

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
        if (err) res.status(500).json(err);
        const userDocs = docs.filter(
          (user) => !req.user.followed_users.includes(user._id),
        );
        res.send(userDocs);
      },
    );
  },
);

userRouter.put(
  '/follow',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    User.findById(req.user._id, (err, user) => {
      if (err) {
        return res.status(500).send(err);
      }
      User.findOne(
        { username: req.body.followee_username },
        (error, followee) => {
          if (error) {
            return res.status(500).send(error);
          }
          const followeeIndex = user.followed_users.indexOf(followee._id);
          // if we do not follow the followee
          if (followeeIndex < 0) {
            // if followee is public
            if (followee.public) {
              user.followed_users.push(followee._id);
              user.save((saveError) => {
                if (saveError) {
                  return res
                    .status(500)
                    .send(
                      `${saveError}Could not save new followed user to database`,
                    );
                }
                return res.status(200).json({
                  msg: `${req.user.username} is now following ${req.body.followee_username}`,
                  follow_status: 'followed',
                });
              });
            } else {
              // followee is private
              const userIndex = followee.pending_followers
                ? followee.pending_followers.indexOf(user._id)
                : -1;
              // user is not in pending followers
              if (userIndex < 0) {
                followee.pending_followers.push(user._id);
              } else {
                // User is trying to cancel pending request
                followee.pending_followers.splice(userIndex, 1);
              }
              followee.save((saveError) => {
                if (saveError) {
                  return res
                    .status(500)
                    .send(
                      `${saveError}Could not save follow request to database`,
                    );
                }
                if (userIndex < 0) {
                  return res.status(200).json({
                    msg: `${req.user.username} has requested to follow ${req.body.follow_username}`,
                    follow_status: 'pending',
                  });
                }
                return res.status(200).json({
                  msg: `${req.user.username} has unrequested to follow ${req.body.follow_username}`,
                  follow_status: 'unfollowed',
                });
              });
            }
          } else {
            // we are unfollowing the followee
            user.followed_users.splice(followeeIndex, 1);
            user.save((saveError) => {
              if (saveError) {
                return res
                  .status(500)
                  .send(
                    `${saveError}Could not save unfollow request to the database`,
                  );
              }
              return res.status(200).json({
                msg: `${req.user.username} has unfollowed ${req.body.followee_username}`,
                follow_status: 'unfollowed',
              });
            });
          }
        },
      );
    });
  },
);

// Route called when a private user makes a decision on whether to let another user follow them
// Expects follower username as a parameter
userRouter.post(
  '/handle_follower_request',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const followerUsername = req.body.follower_username;
    if (!followerUsername) {
      return res.status(500).send('Request must provide follower username');
    }
    User.findOne({ username: followerUsername }, (error, follower) => {
      if (error) {
        return res.status(500).send(error);
      }
      const followerIndex = req.user.pending_followers.indexOf(follower._id);
      if (followerIndex < 0) {
        return res.status(500).send('User not in pending followers');
      }
      const requestStatus = req.body.request_status;
      // Accepted
      if (requestStatus) {
        follower.followed_users.push(req.user._id);
        follower.save();
      }
      req.user.pending_followers.splice(followerIndex, 1);
      req.user.save((saveError) => {
        if (saveError) {
          return res
            .status(500)
            .send(`${saveError}Could not remove request from pending`);
        }
        return res
          .status(200)
          .json({ pending_followers: req.user.pending_followers });
      });
    });
  },
);

// Route returns following status given account in question's username
userRouter.get(
  '/follow_status',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    User.findById(req.user._id, (err, user) => {
      if (err) {
        return res.status(500).send(err);
      }
      User.findOne(
        { username: req.query.followee_username },
        (error, followee) => {
          if (error) {
            return res.status(500).send(error);
          }
          if (String(user._id) === String(followee._id)) {
            return res.status(200).json({ visibility: user.public });
          }
          if (user.followed_users.includes(followee._id)) {
            return res.status(200).json({ follow_status: 'followed' });
          }
          if (
            followee.pending_followers &&
            followee.pending_followers.includes(user._id)
          ) {
            return res.status(200).json({ follow_status: 'pending' });
          }
          return res.status(200).json({ follow_status: 'unfollowed' });
        },
      );
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
          res.status(500).json(err);
        }
        const userDocs = docs.filter((user) =>
          req.user.followed_users.includes(user._id),
        );
        res.send(userDocs);
      },
    );
  },
);

userRouter.get(
  '/pending_followers',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    User.find(
      { _id: { $in: req.user.pending_followers } },
      'username',
      (error, pUsers) => {
        if (error) {
          return res.status(500).send(error);
        }
        return res.status(200).json({ pending_followers: pUsers });
      },
    );
  },
);

userRouter.put(
  '/visibility',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    User.findById(req.user._id, (err, user) => {
      if (err) {
        return res.status(500).send(err);
      }
      // toggle public setting
      user.public = !user.public;
      // if user is now public, accept all pending requests
      if (user.public) {
        for (let i = user.pending_followers.length - 1; i >= 0; i--) {
          User.findById(user.pending_followers[i], (pErr, follower) => {
            if (pErr) {
              return res.status(500).send(pErr);
            }
            follower.followed_users.push(user._id);
            follower.save((saveError) => {
              if (saveError) {
                return res
                  .status(500)
                  .send(
                    `${saveError}Failed to allow adding pending follower to `,
                  );
              }
            });
          });
          user.pending_followers.splice(i, 1);
        }
      }

      user.save((saveError) => {
        if (saveError) {
          return res
            .status(500)
            .send(`${saveError}Could not save privacy change to the database`);
        }
        return res.status(200).json({ visibility: user.public });
      });
    });
  },
);

//Deprecated and not in use. User "follow" route instead
userRouter.post(
  '/unfollow',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    User.findById(req.user._id, (err, user) => {
      if (err) return res.status(500).json(err);
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
