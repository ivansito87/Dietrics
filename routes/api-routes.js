// ===============================================================================
// DEPENDENCIES
// We need to include the path package to get the correct file path for our html
// ===============================================================================
var path = require("path");
var db = require("../models");
const bcrypt = require('bcrypt');
var rp = require('request-promise');

// ===============================================================================

const optionsArr = ["one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten"];
let queryURL = "https://api.edamam.com/api/nutrition-data?app_id=c0bc3d2f&app_key=912969595054b8a128346731ffbf79b3&ingr=";
// Routing

// Define the responses that will handle the html display ========================

module.exports = function (app) {

    const foods = require("../scripts/foods.json");

    //Respond with the api call
    app.get("/api/foods", function (req, res) {
        return res.json(foods);
    });

    //get Profiles from database
    app.get("/api/profiles", function (req, res) {
        db.Profile.findAll({}).then(function (dbProfile) {
            res.json(dbProfile);
        });
    });

    // Make a new post from the user input querying the API and storing the response in DB
    app.post("/api/post", function (req, res) {
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
                    console.log("400");
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

    // ============= query DB and API from server==================================================================
    app.post("/api/query", function (req, res) {
        console.log(req.body.foodRequest);
        let userInput = req.body.foodRequest;

        //default the user's query to have the word 'one' if it doesn't
        const wordWithNoOne = userInput.split(" ")[0];
        if (!optionsArr.includes(wordWithNoOne.toLowerCase())) {
            userInput = "one%20" + userInput;
        }

        console.log(userInput);
        queryURL += userInput;

        db.Food.findOne({
            where: {
                name: userInput
            }
        }).then(function (dbFood) {
                console.log(dbFood);
                // If food not on database
                if (!dbFood) {
                    //query api if it doesn't exist in our system
                    rp(queryURL).then(apiData => {
                        //normalize the apiData to be stored in database
                        const newFood = normalized(apiData, userInput);
                        //create a post
                        db.Food.create(newFood)
                            .then(function (dbFood) {
                                res.json(dbFood);
                            });
                        console.log(newFood);
                    }).catch(err => {
                        console.log(err);
                    });
                // else if it exists in DB we respond with it
                } else {
                    res.json(dbFood);
                }
            }
        );
    });
};
// ===============================================================================




// Function to normalize data ============================
function normalized(data, name) {
    let foods = JSON.parse(data);
    let food = foods.totalDaily;
    let calories = foods.calories;
    let caloriesFromFat = foods.totalNutrientsKCal.FAT_KCAL.quantity ? foods.totalNutrientsKCal.FAT_KCAL.quantity : 0;
    let carbs = food.CHOCDF.quantity ? food.CHOCDF.quantity : 0;
    console.log(carbs);
    let dietary_Fiber = food.FIBTG ? food.FIBTG.quantity : 0;
    let sugars = foods.totalNutrients.SUGAR ? foods.totalNutrients.SUGAR.quantity : 0;
    let added_sugars = food["SUGAR.added"] ? food["SUGAR.added"].quantity : 0;
    let fat = food.FAT ? food.FAT.quantity : 0;
    let saturated = food.FASAT ? food.FASAT.quantity : 0;
    let cholesterol = foods.totalNutrients.CHOLE ? foods.totalNutrients.CHOLE.quantity : 0;
    let polyunsaturated = food.FAPU ? food.FAPU.quantity : 0;
    let monounsaturated = food.FAMS ? food.FAMS.quantity : 0;
    let protein = food.PROCNT ? food.PROCNT.quantity : 0;
    let sodium = food.NA ? food.NA.quantity : 0;
    let potassium = food.K ? food.K.quantity : 0;
    let vitamin_A = food.VITA_RAE ? food.VITA_RAE.quantity : 0;
    let vitamin_C = food.VITD ? food.VITD.quantity : 0;
    let vitamin_D = food.VITC ? food.VITC.quantity : 0;
    let calcium = food.CA ? food.CA.quantity : 0;
    let iron = food.FE ? food.FE.quantity : 0;
    return {
        name: name.split("%20").join(" "),
        calories: parseFloat(calories).toFixed(2),
        caloriesFromFat : parseFloat(caloriesFromFat).toFixed(2),
        carbs: parseFloat(carbs).toFixed(2),
        dietary_Fiber: parseFloat(dietary_Fiber).toFixed(2),
        sugars: parseFloat(sugars).toFixed(2),
        added_sugars: parseFloat(added_sugars).toFixed(2),
        fat: parseFloat(fat).toFixed(2),
        saturated: parseFloat(saturated).toFixed(2),
        polyunsaturated: parseFloat(polyunsaturated).toFixed(2),
        monounsaturated: parseFloat(monounsaturated).toFixed(2),
        protein: parseFloat(protein).toFixed(2),
        sodium: parseFloat(sodium).toFixed(2),
        potassium: parseFloat(potassium).toFixed(2),
        cholesterol: parseFloat(cholesterol).toFixed(2),
        vitamin_A: parseFloat(vitamin_A).toFixed(2),
        vitamin_C: parseFloat(vitamin_C).toFixed(2),
        vitamin_D: parseFloat(vitamin_D).toFixed(2),
        calcium: parseFloat(calcium).toFixed(2),
        iron: parseFloat(iron).toFixed(2)
    }
}
