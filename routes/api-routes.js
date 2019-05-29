// ===============================================================================
// DEPENDENCIES
// We need to include the path package to get the correct file path for our html
// ===============================================================================
var path = require("path");
var foods = require("foods.json");

// ===============================================================================
// Routing

// Define the responses that will handle the html display ========================

module.exports = function (app) {

    // Respond with the html file for home
    app.get("/", function (req, res) {
        res.sendFile(path.join(__dirname, "../public/index.html"));
    });

    //Respond with the html for survey
    app.get("/user", function (req, res) {
        res.sendFile(path.join(__dirname, "../public/user.html"))
    });

    //Respond with the html for survey
    app.get("/pt", function (req, res) {
        res.sendFile(path.join(__dirname, "../public/pt.html"))
    });

    //Respond with the api call
    app.get("/api/foods", function (req, res) {
        return res.json(foods);
    });

    app.get("*", function (req, res) {
        res.sendFile(path.join(__dirname, "../public/index.html"));
    });

};

// ===============================================================================
