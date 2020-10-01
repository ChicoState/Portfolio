const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const User = require('./models/user');

require('dotenv').config();
require('./passportConfig')(passport);

const app = express();

mongoose.connect(
  `${process.env.MONGO_URL}`,
  {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
  },
  () => {
    console.log('Mongoose is connected.');
  }
);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(
  session({
    secret: 'secretcode',
    resave: true,
    saveUninitialized: true,
  }),
);
app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  }),
);
app.use(cookieParser('secretcode'));
app.use(passport.initialize());
app.use(passport.session());

app.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user) => {
    if (err) {
      throw err;
    }
    if (!user) {
      res.send('No user exists!');
    } else {
      req.login(user, (error) => {
        if (error) {
          throw error;
        }
        res.send('Successfully authenticated!');
        console.log(req.user);
      });
    }
  })(req, res, next);
});

app.post('/register', async (req, res) => {
  const newUser = new User({
    username: req.body.registerUsername,
    password: req.body.registerPassword,
    email: req.body.registerEmail,
    role: 'user',
    first_name: req.body.registerFirstName,
    middle_name: req.body.registerMiddleName,
    last_name: req.body.registerLastName,
  });
  await newUser.save((err) => {
    if (err) {
      res.json(err);
    }
    return res.send(`User ${req.body.registerUsername} successfully created.`);
  });
});

app.get('/user', (req, res) => {
  res.send(req.user);
});

app.get('/api/greeting', (req, res) => {
  mongoose.connect(`${process.env.MONGO_URL}`).then(() => {
    res.json({ message: 'Successfully connected to database!' });
    console.log('Successfully connected to database!');
  });
});

app.listen(3001, () => {
  console.log('Express server is running on localhost:3001');
});
