const express = require('express');

const passport = require('passport');

const postRouter = express.Router();
require('../passport.js');

const multer = require('multer');
const path = require('path');
const fs = require('fs');
const hasha = require('hasha');
const Post = require('../models/post');
const Attachment = require('../models/attachment');
const User = require('../models/user.js');

const upload = multer({ dest: path.join(__dirname, '.') });

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
    });
    const promises = req.files.map(async (file) => {
      let fileStream = fs.createReadStream(file.path);
      const hash = await hasha.fromStream(fileStream, { algorithm: 'md5' });
      const fileName = hash + path.extname(file.originalname);
      fileStream = fs.createReadStream(file.path);
      const existing = await Attachment.findOne({ filename: fileName });
      if (!existing) {
        const attachment = new Attachment({ filename: fileName });
        await attachment.upload(fileStream);
      }
      newPost.attachments.push(fileName);
      fs.unlinkSync(file.path);
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

postRouter.get(
  '/follow_feed',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Post.find({
      user: req.user.followed_users
    })
    .exec((err, posts) => {
      if(err) {
        return res.status(400).json(err);
      }
      return res.json(posts);
    })
  },
);

module.exports = postRouter;
