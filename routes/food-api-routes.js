const db = require("../models");
const passport = require('passport');
var rp = require('request-promise');

// ===============================================================================

const optionsArr = ["one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten"];
let queryURL = "https://api.edamam.com/api/nutrition-data?app_id=c0bc3d2f&app_key=912969595054b8a128346731ffbf79b3&ingr=";

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


    // ============= query DB and API from server==================================================================
    app.post("/api/query", function (req, res) {
        console.log(req.body.foodRequest);
        let userInput = req.body.foodRequest;

        //default the user's query to have the word 'one' if it doesn't
        const wordWithNoOne = userInput.trim().split(" ")[0];
        if (!optionsArr.includes(wordWithNoOne.toLowerCase())) {
            userInput = "one%20" + userInput;
        }

        console.log(userInput);
        queryURL += userInput;

        db.Food.findOne({
            where: {
                name: {
                    [db.Sequelize.Op.eq]: userInput
                }
            }
        }).then(function (dbFood) {
            // console.log("dbFood form db:");
            // console.log(dbFood);
            // If food not on database

            if (!dbFood) {
                //query api if it doesn't exist in our system
                console.log("querying the api!");
                rp(queryURL).then(apiData => {
                    //normalize the apiData to be stored in database
                    // console.log("query response from api")
                    // console.log(apiData);
                    const newFood = normalized(apiData, userInput);
                    console.log("query response after normalizing");
                    console.log(newFood);
                    //create a post
                    db.Food.create(newFood)
                        .then(function (resFoodDB) {
                            // console.log("query response db to user");
                            // console.log(resFoodDB);
                            res.json(resFoodDB);
                        });


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
    let caloriesFromFat = foods.totalNutrientsKCal.FAT_KCAL ? foods.totalNutrientsKCal.FAT_KCAL.quantity : 0;
    let carbs = food.CHOCDF ? food.CHOCDF.quantity : 0;
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
        caloriesFromFat: parseFloat(caloriesFromFat).toFixed(2),
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





