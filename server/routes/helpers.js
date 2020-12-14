const hasha = require('hasha');
const path = require('path');
const bucket = require('../storage');

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

module.exports = { uploadFile: uploadFile };
