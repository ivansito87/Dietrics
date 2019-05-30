const db = require("../models");
module.exports = function (app) {
    
    app.post("/api/profiles", function(req, res) {
		db.Profile.create(req.body).then(function(dbProfile) {
			res.json(dbProfile);
		});
	});

};