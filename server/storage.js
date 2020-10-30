const { Storage } = require('@google-cloud/storage');
require('dotenv').config();

const storage = new Storage({
  projectId: `${process.env.PROJECT_ID}`,
  keyFilename: `${process.env.KEY_FILENAME}`,
});

const bucket = storage.bucket(`${process.env.REACT_APP_BUCKET_NAME}`);

module.exports = bucket;
