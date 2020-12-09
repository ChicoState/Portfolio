const express = require('express');

const app = express();
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const cors = require('cors');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());
require('dotenv').config();

const userRouter = require('./routes/user');

app.use('/user', userRouter);

const postRouter = require('./routes/post');

app.use('/post', postRouter);

if (process.env.NODE_ENV !== 'test') {
  mongoose.connect(
    `${process.env.MONGO_URL}`,
    {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useCreateIndex: true,
    },
    () => {
      console.log('Mongoose is connected.');
    },
  );

  app.listen(3001, () => {
    console.log('Express server is running on localhost:3001');
  });
}

module.exports = app;
