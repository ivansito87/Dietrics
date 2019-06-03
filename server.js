require('dotenv').config();
const express = require("express");
const passport = require('passport');
const app = express();

var PORT = process.env.PORT || 8080;

var db = require("./models");
const { router:authRouter, basicStrategy, jwtStrategy } = require('./auth');

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());



// Static directory
app.use(express.static("public"));

//authentification endpoints
app.use(passport.initialize());
passport.use(basicStrategy);
passport.use(jwtStrategy);

// Routes
// =============================================================
require("./routes/api-user-routes.js")(app);
require("./routes/html-routes.js")(app);
require("./routes/food-api-routes")(app);

app.use('/api/auth/', authRouter);

// Syncing our sequelize models and then starting our Express app
// =============================================================
db.sequelize.sync().then(function() {
  app.listen(PORT, function() {
    console.log("App listening on http://localhost:" + PORT);
  });
});
