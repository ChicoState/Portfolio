const express = require('express');

const passport = require('passport');

const postRouter = express.Router();
const Post = require('../models/post');
require('../passport.js');

postRouter.post(
  '/create',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const newPost = new Post({
      title: req.body.title,
      message: req.body.message,
      user: req.user._id,
      profession: 'artist',
    });
    newPost
      .save()
      .then(() => res.send(`Post ${req.body.title} successfully created.`))
      .catch((err) => {
        res.status(400).json(err);
      });
  },
);

postRouter.post(
  '/delete',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Post.findById(req.body.id)
      .then((post) => {
        if (String(post.user) !== String(req.user._id)) {
          return res.status(400).json('Invalid deletion request.');
        }
        post.delete();
        return res.send(`Post ${req.body.id} successfully deleted.`);
      })
      .catch((err) => {
        res.status(400).json(err);
      });
  },
);

postRouter.post(
  '/view',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Post.find({
      user: req.body.id ? req.body.id : req.user._id,
    }).exec((err, posts) => {
      if (err) {
        return res.status(400).json(err);
      }
      return res.json(posts);
    });
  },
);

module.exports = postRouter;
