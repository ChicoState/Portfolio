const express = require('express');

const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.json());
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

app.get('/api/greeting', (req, res) => {
  mongoose.connect(`${process.env.MONGO_URL}`).then(() => {
    res.json({ message: 'Successfully connected to database!' });
    console.log('Successfully connected to database!');
  });
});

app.listen(3001, () => {
  console.log('Express server is running on localhost:3001');
});
