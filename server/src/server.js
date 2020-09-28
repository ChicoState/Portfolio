const express = require('express');
const bodyParser = require('body-parser');
const pool = require('./db');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/api/greeting', (req, res) => {
  pool.connect().then(() => {
    res.json({ message: 'Successfully connected to database!' });
    console.log('Successfully connected to database!');
  });
});

app.listen(3001, () => {
  console.log('Express server is running on localhost:3001');
});
