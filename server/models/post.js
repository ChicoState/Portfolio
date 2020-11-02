const mongoose = require('mongoose');
const MongoPaging = require('mongo-cursor-pagination');
const bucket = require('../storage');

const PostSchema = mongoose.Schema({
  title: {
    type: String,
    max: 70,
  },
  message: {
    type: String,
    max: 1024,
  },
  attachments: [
    {
      type: String,
    },
  ],
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
  username: {
    type: String,
  },
});

PostSchema.pre('remove', function (next) {
  for (let i = 0; i < this.attachments.length; i += 1) {
    const attachment = this.attachments[i];
    this.constructor.countDocuments(
      { attachments: attachment },
      (err, count) => {
        if (err) {
          console.log(err);
        }
        if (count <= 1) {
          bucket.file(attachment).delete();
        }
      },
    );
  }
  next();
});

PostSchema.plugin(MongoPaging.mongoosePlugin);

module.exports = mongoose.model('Post', PostSchema);
