// ===============================================================================
// DEPENDENCIES
// We need to include the path package to get the correct file path for our html
// ===============================================================================
var path = require("path");
var db = require("../models");
const bcrypt = require('bcrypt');
// Routing

// Define the responses that will handle the html display ========================

module.exports = function (app) {

// <<<<<<< HEAD:routes/api-user-routes.js
  

  app.get("/api/user/profiles", function (req, res) {
    db.Profile.findAll({}).then(function (dbProfile) {
      res.json(dbProfile);
    });
  });

  app.get("/api/user/:id", function (req, res) {
    console.log(req.params.id)
    db.Profile.findOne({where: {id:req.params.id}})
    .then(function (user) {
      res.json(user);
    });
  });

  // app.post("/api/user/post", function (req, res) {
  //   console.log(req.body);
   
  //   let username = (req.body.username).trim();
  //    db.Profile.findAndCountAll({ where: { username: username } })
  //     .then(result => {
  //       if (result.count > 0) {
  //          return res.status(400).send({
  //           reason: 'ValidationError',
  //           message: 'user already taken',
  //           location: 'username'
  //         });
    // const foods = require("../scripts/foods.json");

    // //Respond with the api call
    // app.get("/api/foods", function (req, res) {
    //     return res.json(foods);
    // });

    // //get Profiles from database
    // app.get("/api/profiles", function (req, res) {
    //     db.Profile.findAll({}).then(function (dbProfile) {
    //         res.json(dbProfile);
    //     });
    // });

    // Make a new post from the user input querying the API and storing the response in DB
    app.post("/api/user/post", function (req, res) {
        // Our request comes on the body of the api/post
        console.log(req.body);     //<-------- Testing the request from the front end

        let username = (req.body.name).trim();
        db.Profile.findAndCountAll({where: {username: username}})
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
                console.log(newUser);
                db.Profile.create(req.body)
                    .then(data => {
                        res.json(data);

                    })
                    .catch(err => {
                        //console.log('error checking!');
                        //console.log(err)
                        res.status(500).json({message: 'Internal server error'});
                    });
            })

    });

}