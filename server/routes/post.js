const express = require('express');

const passport = require('passport');

const postRouter = express.Router();
require('../passport.js');

const multer = require('multer');
const path = require('path');
const hasha = require('hasha');
const Post = require('../models/post');
const bucket = require('../storage');

const upload = multer({ storage: multer.memoryStorage() });

const uploadFile = (file) =>
  new Promise((resolve, reject) => {
    const hash = hasha(file.buffer, { algorithm: 'md5' });
    const filename = hash + path.extname(file.originalname);
    const bucketFile = bucket.file(filename);
    bucketFile.exists((err, exists) => {
      if (err || !exists) {
        const stream = bucketFile.createWriteStream({
          resumable: false,
          metadata: {
            contentDisposition: 'attachment',
          },
        });
        stream.on('finish', () => {
          resolve(filename);
        });
        stream.on('error', (error) => {
          reject(
            new Error(`Unable to upload file, something went wrong: ${error}`),
          );
        });
        stream.end(file.buffer);
      } else {
        resolve(filename);
      }
    });
  });

postRouter.post(
  '/create',
  passport.authenticate('jwt', { session: false }),
  upload.any(),
  async (req, res) => {
    const newPost = new Post({
      title: req.body.title,
      message: req.body.message,
      user: req.user._id,
      profession: 'artist',
      username: req.user.username,
    });
    const promises = req.files.map(async (file) => {
      const filename = await uploadFile(file);
      newPost.attachments.push(filename);
    });
    await Promise.all(promises);
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

module.exports = postRouter;
