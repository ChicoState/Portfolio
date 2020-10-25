const express = require('express');
require('../passport.js');

const attachmentRouter = express.Router();
const Attachment = require('../models/attachment');

attachmentRouter.get('/:filename', async (req, res) => {
  const attachment = await Attachment.findOne({
    filename: req.params.filename,
  });

  if (attachment) {
    const range = req.range();
    if (range && range[0]) {
      const { start } = range[0];
      const end = range[0].end ? range[0].end : attachment.length;
      const chunksize = end - start + 1;
      res.writeHead(206, {
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize,
        'Content-Range': `bytes ${start}-${end}/${attachment.length}`,
      });
      const bucket = attachment.model.getBucket();
      const downloadStream = bucket.openDownloadStream(attachment._id, {
        start,
        end: end + 1,
      });
      downloadStream.pipe(res);
    } else {
      res.attachment(attachment.filename);
      attachment.downloadStream(res);
    }
  } else {
    res.status(404).json({ error: 'File not found.' });
  }
});

module.exports = attachmentRouter;
