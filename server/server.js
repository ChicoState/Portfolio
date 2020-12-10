const express = require('express');

const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const cors = require('cors');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.json());
app.use(cors());
require('dotenv').config();

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

const userRouter = require('./routes/user');

app.use('/user', userRouter);

const postRouter = require('./routes/post');

app.use('/post', postRouter);

app.listen(3001, () => {
  console.log('Express server is running on localhost:3001');
});
