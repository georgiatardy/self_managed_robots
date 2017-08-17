const express = require('express');
const routes = express.Router();
// const db = require('../db');
const Robot = require('../models/robot')

const requireLogin = (req, res, next) => {
  if (req.user) {
    next();
  } else {
    res.redirect('/login');
  }
};

routes.use(requireLogin);

routes.get('/', (req, res) => {
  Robot.find({}, function(err, robots) {
    res.render('home', {robots: robots});
  });

  // let collect = db.get().collection('robot');
  //
  // collect.find({}).toArray((err, robot) => {
  //   res.render('home', {
  //     robots: robot
  //   });

});

//===Profile page for individual robots===//

routes.get('/:userName', (req, res) => {
  // let robot = req.params.robot
  // let collection = db.get().collection('robot');

  Robot.findOne({
    'username': req.params.userName
  }, (err, robot) => {
    res.render('profile', robot);
  });

  // collection.find({
  //   username: req.params.username
  // }).toArray((err, robot) => {
  //   console.log(robot);
  //   res.render('profile', {
  //     robots: robot
  //   });
});


module.exports = routes;
