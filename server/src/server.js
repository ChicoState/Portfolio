const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('dotenv').config();


const app = express();
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/api/greeting', (req, res) => {
  mongoose.connect(`${process.env.MONGO_URL}`).then(() => {
    res.json({ message: 'Successfully connected to database!' });
    console.log('Successfully connected to database!');
  });
});

app.listen(3001, () => {
  console.log('Express server is running on localhost:3001');
});
