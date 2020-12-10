const express = require('express');

const passport = require('passport');

const postRouter = express.Router();
require('../passport.js');

const multer = require('multer');
const Post = require('../models/post');

const upload = multer({ storage: multer.memoryStorage() });
const helpers = require('./helpers');

postRouter.post(
  '/create',
  passport.authenticate('jwt', { session: false }),
  upload.any(),
  async (req, res) => {
    const newPost = new Post({
      title: req.body.title,
      message: req.body.message,
      user: req.user._id,
      tags: req.body.tags.toString().replace(/\s+/g, '').split(','),
      username: req.user.username,
    });
    if (req.files) {
      const promises = req.files.map(async (file) => {
        const filename = await helpers.uploadFile(file);
        newPost.attachments.push(filename);
      });
      await Promise.all(promises);
    }
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

postRouter.get(
  '/view/:username',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Post.paginate({
      query: {
        username: req.params.username,
      },
      paginatedField: 'timestamp',
      limit: parseInt(req.query.limit, 10),
      next: req.query.next,
      previous: req.query.previous,
    })
      .then((posts) => res.json(posts))
      .catch((err) => res.status(400).json(err));
  },
);

postRouter.get(
  '/feed',
  passport.authenticate(['jwt', 'anonymous'], { session: false }),
  (req, res) => {
    let feedQuery = {};
    if (req.user) {
      const feedUsers = req.user.followed_users;
      feedUsers.push(req.user._id);
      feedQuery = {
        user: {
          $in: req.user.followed_users,
        },
      };
    }
    Post.paginate({
      query: feedQuery,
      paginatedField: 'timestamp',
      limit: parseInt(req.query.limit, 10),
      next: req.query.next,
      previous: req.query.previous,
    })
      .then((posts) => res.json(posts))
      .catch((err) => res.status(400).json(err));
  },
);

postRouter.get(
  '/discovery',
  passport.authenticate(['jwt', 'anonymous'], { session: false }),
  (req, res) => {
    const searchArray = req.query.tags.replace(/\s+/g, '').split(',');
    const regex = searchArray.map((element) => new RegExp(element, 'i'));
    let feedQuery = {};
    feedQuery = {
      $or: [
        {
          username: {
            $in: regex,
          },
        },
        {
          tags: {
            $in: regex,
          },
        },
        {
          title: {
            $in: regex,
          },
        },
        {
          message: {
            $in: regex,
          },
        },
      ],
    };
    Post.paginate({
      query: feedQuery,
      paginatedField: 'timestamp',
      limit: parseInt(req.query.limit, 10),
      next: req.query.next,
      previous: req.query.previous,
    })
      .then((posts) => {
        res.json(posts);
      })
      .catch((err) => {
        res.status(400).json(err);
      });
  },
);

module.exports = postRouter;
