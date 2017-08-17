const express = require('express');
const routes = express.Router();
const db = require('../db');



// routes.use();

routes.get('/', (req, res) => {
  let collect = db.get().collection('robot');

  collect.find({}).toArray((err, robot) => {
    res.render('home', {robots: robot});
    // console.log({robots:robot});

  });
});

//===Profile page for individual robots===//

routes.get('/:robot', (req, res) => {
  // let robot = req.params.robot
  let collection = db.get().collection('robot');

  collection.find({username: req.params.username}).toArray ((err, robot) => {
    console.log(robot);
    res.render('profile', {robots: robot});
  });
});

module.exports = routes;
