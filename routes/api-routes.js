// ===============================================================================
// DEPENDENCIES
// We need to include the path package to get the correct file path for our html
// ===============================================================================
var path = require("path");

// ===============================================================================
// Routing

// Define the responses that will handle the html display ========================

module.exports = function (app) {

    const foods = require("../scripts/foods.json");

    //Respond with the api call
    app.get("/api/foods", function (req, res) {
        return res.json(foods);
    });


};

// ===============================================================================
