// ===============================================================================
// DEPENDENCIES
// We need to include the path package to get the correct file path for our html
// ===============================================================================
var path = require("path");
var db = require("../models");

// ===============================================================================
// Routing

// Define the responses that will handle the html display ========================

module.exports = function (app) {

    const foods = require("../scripts/foods.json");

    //Respond with the api call
    app.get("/api/foods", function (req, res) {
        return res.json(foods);
    });

    app.get("/api/profiles", function(req, res) {
        db.Profile.findAll({}).then(function(dbProfile) {
          res.json(dbProfile);
        });
      });
   app.post("/api/post", function(req, res){
     console.log(req.body);
     db.Profile.create(req.body)
     .then(function(data){
       console.log(data);
       res.json(data);
     })
   })

};

// ===============================================================================
