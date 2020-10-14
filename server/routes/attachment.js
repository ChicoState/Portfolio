const express = require('express');
require('../passport.js');

const attachmentRouter = express.Router();
const Attachment = require('../models/attachment');

attachmentRouter.get('/:filename', async (req, res) => {
  const attachment = await Attachment.findOne({
    filename: req.params.filename,
  });
  if (attachment) {
    res.attachment(attachment.filename);
    attachment.downloadStream(res);
  } else {
    res.status(404).json({ error: 'File not found.' });
  }
});

module.exports = attachmentRouter;
