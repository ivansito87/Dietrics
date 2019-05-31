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



    // Respond with the html file for home
    app.get("/", function (req, res) {
        res.sendFile(path.join(__dirname, "/public/index.html"));
    });

    //Respond with the html for user
    app.get("/user", function (req, res) {
        res.sendFile(path.join(__dirname, "../public/user.html"))
    });

    //Respond with the html for Personal Trainer
    app.get("/pt", function (req, res) {
        res.sendFile(path.join(__dirname, "../public/pt.html"))
    });

    app.get("/main", function (req, res) {
        res.sendFile(path.join(__dirname, "../public/main.html"))
    });


    app.get("*", function (req, res) {
        res.sendFile(path.join(__dirname, "../public/index.html"));
    });

    //Respond with index.html for anything that the user might type in the url bar

};

// ===============================================================================
