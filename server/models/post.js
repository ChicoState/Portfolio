const mongoose = require('mongoose');

const PostSchema = mongoose.Schema({
  title: {
    type: String,
    max: 70,
  },
  message: {
    type: String,
    max: 1024,
  },
  /*
    attachments: [{
      attachment: mongoose.Schema({
        type: String,
        data: Buffer
      })
    }],
    */
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Post must have a user'],
  },
  profession: {
    type: String,
    enum: ['artist', 'painter', 'photographer'],
  },
  timestamp: {
    type: Date,
    required: [true, 'Post must have timestamp'],
    default: Date.now,
  },
});

module.exports = mongoose.model('Post', PostSchema);
