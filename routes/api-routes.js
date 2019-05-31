// ===============================================================================
// DEPENDENCIES
// We need to include the path package to get the correct file path for our html
// ===============================================================================
var path = require("path");
var db = require("../models");
const bcrypt = require('bcrypt');

// ===============================================================================
// Routing

// Define the responses that will handle the html display ========================

module.exports = function (app) {

  const foods = require("../scripts/foods.json");

  //Respond with the api call
  app.get("/api/foods", function (req, res) {
    return res.json(foods);
  });

  app.get("/api/profiles", function (req, res) {
    db.Profile.findAll({}).then(function (dbProfile) {
      res.json(dbProfile);
    });
  });

  app.post("/api/post", function (req, res) {
    console.log(req.body);
   
    let username = (req.body.username).trim();
     db.Profile.findAndCountAll({ where: { username: username } })
      .then(result => {
        if (result.count > 0) {
           return res.status(400).send({
            reason: 'ValidationError',
            message: 'user already taken',
            location: 'username'
          });
          console.log("400");
        }
         const hash = bcrypt.hashSync(req.body.password, 10);
         const newUser = req.body;
         newUser.password = hash;
         console.log(newUser);
         db.Profile.create(req.body)
        .then(data =>  {
          res.json(data);

        })
        .catch(err => {
          //console.log('error checking!');
          //console.log(err)
          res.status(500).json({ message: 'Internal server error' });
        });
      })
      
  });



}
// ===============================================================================
