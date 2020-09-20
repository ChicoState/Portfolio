const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/api/greeting', (req, res) => {
    res.json({message: "Hello World"});
    console.log("Hello");
});

app.listen(3001, () =>
  console.log('Express server is running on localhost:3001')
);