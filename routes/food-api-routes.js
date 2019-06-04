const db = require("../models");
const passport = require('passport');
module.exports = function (app) {
    
  //   app.post("/api/profiles", function(req, res) {
	// 	db.Profile.create(req.body).then(function(dbProfile) {
	// 		res.json(dbProfile);
	// 	});
	// });

	const foods = require("../scripts/foods.json");
	//passport.authenticate('jwt', {session: false}),
  //Respond with the api call
	app.get("/api/protected/foods", 
					function (req, res) {
    return res.json(foods);
	});
	
	
	

};