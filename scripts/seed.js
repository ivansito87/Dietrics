//"large" 1.2x calories, "small" .8x calories to standard one "   " [food]
//cup, teaspoon, tablespoon, etc. conversions table needed
//total weight is grams

const foods = require('./foods');
const db = require('../models');


/// =========== >>>>>>>>> condition ? exprIfTrue : exprIfFalse  <<<<<<<<<<<<+++++++++++++++
function normalized(foods) {
    return foods.map(function (food) {
        let fDaily = food.totalDaily;
        let name = food.name;
        let calories = food.calories;
        let caloriesFromFat = food.totalNutrientsKCal.FAT_KCAL ? food.totalNutrientsKCal.FAT_KCAL.quantity : 0;
        let carbs = fDaily.CHOCDF ? fDaily.CHOCDF.quantity : 0;
        let dietary_Fiber = fDaily.FIBTG ? fDaily.FIBTG.quantity : 0;
        let sugars = food.totalNutrients.SUGAR ? food.totalNutrients.SUGAR.quantity : 0;
        let added_sugars = fDaily["SUGAR.added"] ? fDaily["SUGAR.added"].quantity : 0;
        let fat = fDaily.FAT ? fDaily.FAT.quantity : 0;
        let transFat = food.totalNutrients.FATRN ? food.totalNutrients.FATRN.quantity : 0;
        let saturated = fDaily.FASAT ? fDaily.FASAT.quantity : 0;
        let cholesterol = food.totalNutrients.CHOLE ? food.totalNutrients.CHOLE.quantity : 0;
        let polyunsaturated = fDaily.FAPU ? fDaily.FAPU.quantity : 0;
        let monounsaturated = fDaily.FAMS ? fDaily.FAMS.quantity : 0;
        let protein = fDaily.PROCNT ? fDaily.PROCNT.quantity : 0;
        let sodium = fDaily.NA ? fDaily.NA.quantity : 0;
        let potassium = fDaily.K ? fDaily.K.quantity : 0;
        let vitamin_A = fDaily.VITA_RAE ? fDaily.VITA_RAE.quantity : 0;
        let vitamin_C = fDaily.VITD ? fDaily.VITD.quantity : 0;
        let vitamin_D = fDaily.VITC ? fDaily.VITC.quantity : 0;
        let calcium = fDaily.CA ? fDaily.CA.quantity : 0;
        let iron = fDaily.FE ? fDaily.FE.quantity : 0;
        return {
            name: name,
            calories: parseFloat(calories).toFixed(2),
            caloriesFromFat: parseFloat(caloriesFromFat),
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

    })
}

const foodsNor = normalized(foods);
console.log(JSON.stringify(foodsNor));

db.sequelize.sync({force: true}).then(function () {
    db.Food.bulkCreate(foodsNor)
        .then(function (rows) {
            console.log("Seeded")
        }).catch(function (err) {
        console.log("Error", err)
    })
});