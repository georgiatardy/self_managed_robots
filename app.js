//===Packages===//

const fs = require('fs');
const robotRoutes = require('./routes/robots');
const express = require('express');
const flash = require('express-flash-messages');
const session = require('express-session');
const mongodb = require('mongodb');
const mongoose = require('mongoose');
const passport = require('passport');
const passportLocal = require('passport-local').Strategy
const bodyParser = require('body-parser');
const handlebars = require('express-handlebars');
let url = 'mongodb://localhost:27017/robotDatabase';
const app = express();
const Robot = require('./models/robot');



// ================= Boilerplate ================ //

// === Passport === //
passport.use(
  new passportLocal(function(username, password, done) {
    console.log('passportLocal', username, password);
    Robot.authenticate(username, password)
      // === Success!! === //
      .then(user => {
        if (user) {
          done(null, user);
        } else {
          done(null, null, {
            message: 'No user with this email and password.'
          });
        }
      })
      // === There was a problem === //
      .catch(err => done(err));
  })
);

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});


// === Middleware to parse form data === //

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));


// === For Handlebars Express === //

app.engine('handlebars', handlebars());
app.set('views', './views');
app.set('view engine', 'handlebars');

app.use(express.static('public'));

// === Creates A Session === //

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUnintialized: false,
}));

app.use(passport.initialize());

app.use(passport.session());

app.use(flash());

// === Local Login Form === //

app.get('/login', (req, res) => {
  res.render('login', {
    failed: req.query.failed
  });
});

app.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login?failed=true',
  failureFlash: true
}));

app.get('/register', (req, res) => {
  res.render('register');
});

app.post('/register', (req, res) => {

  let robot = new Robot(req.body);
  robot.provider = 'local';

  robot.setPassword(req.body.password);


  robot
    .save()
    // if good...
    .then(() => res.redirect('/'))
    // if bad...
    .catch(err => console.log(err));
});



// === Log out === //
app.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

// ========Connection to Robot Database==== //


app.use('/', robotRoutes);



mongoose.connect(url, { useMongoClient: true })
.then(() => {
  app.listen(3000, function() {
    console.log('App is running!');
  });
});
