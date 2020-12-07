const bucket = require('../storage');

function deleteAttachment(attachment) {
  bucket.file(attachment).delete();
}

module.exports = { deleteAttachment: deleteAttachment };