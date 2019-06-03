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

  

  app.get("/api/user/profiles", function (req, res) {
    db.Profile.findAll({}).then(function (dbProfile) {
      res.json(dbProfile);
    });
  });

  app.post("/api/user/post", function (req, res) {
    console.log('checked passed 1');
    console.log(req.body);
   
    let username = (req.body.name).trim();
     db.Profile.findAndCountAll({ where: { username: username } })
      .then(result => {
        if (result.count > 0) {
           return res.status(400).send({
            reason: 'ValidationError',
            message: 'user already taken',
            location: 'username'
          });
        }
         const hash = bcrypt.hashSync(req.body.password, 10);
         const newUser = req.body;
         newUser.password = hash;
         console.log('checked passed 2');
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
