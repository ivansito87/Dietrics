function isValidField(requiredField) {
    const missingField = requiredField.find(field => field === "");
    console.log('missingField=' + missingField)
    console.log(requiredField)
    if (missingField == "") {
        return false;
    } else {
        return true;
    }
}

$(document).ready(function () {
    $(".btnContact").click(function (event) {
        event.preventDefault();
        const name = $("#name").val();
        const age = $("#age").val();
        const weight = $("#weight").val();
        const height = $("#height").val();
        const gender = $("input[type='radio'][name='gender']:checked").val();
        const isPregnant = ($("input[type='radio'][name='isPregnant']:checked").val() === "true") ? true : false;
        const username = $("#username").val();
        const password = $("#password").val();
        const passwordConfirm = $("#passwordConfirm").val();
        if (password !== passwordConfirm) {
            $(".userError").text("Password not match!");
        } else {
            const newUser = {
                name: name,
                username: username,
                password: password,
                age: age,
                gender: gender,
                height: height,
                weight: weight,
                isPregnant: isPregnant
            };
            console.log(newUser);

            //user validation on empty field and non defined field input.
            const requiredField = [
                {field: "name", val: name},
                {field: "username", val: username},
                {field: "password", val: password},
                {field: "age", val: age},
                {field: "height", val: height},
                {field: "weight", val: weight}];

            let requiredFieldFlag = false;
            requiredField.forEach(field => {
                if (field.val === "" || field === undefined) {
                    requiredFieldFlag = true;
                    $("#" + field.field).addClass("error");
                } else {
                    $("#" + field.field).removeClass("error");
                }
            });

            if (requiredFieldFlag) {
                $(".userError").text("Please fill out the form!");
            } else {
                $.post("/api/post", newUser)
                    .then(function (res) {
                        $("#username").removeClass("error");
                        $(".userError").text();
                        console.log(JSON.stringify(res));
                        //redirect to user account

                    })
                    .catch(function (error) {
                        if (error.status == "400") {
                            $("#username").addClass("error");
                            $(".userError").text("username already taken!");
                        } else {
                            console.log('Internal Error');
                        }


                    })
            }
        }

    });


    $("#bttonSearch").on("click", (e) => {
        e.preventDefault();
        let userInput = $("#inputSearch").val();
        userInput.split(" ").join("%20");
        searchFood(userInput);
    });
});


function searchFood(foodRequest) {
    $.post("/api/query", {foodRequest})
        .then(function (data) {    //<---------- Response from database

            const food = data;
            console.log(food);
            const foodName = food.name;

            // response from the database query
            $("#servingSize").text(foodName.charAt(0).toUpperCase() + foodName.slice(1));
            $("#calories").text(Math.floor(food.calories));
            $("#caloriesFromFat").text(Math.floor(food.caloriesFromFat));
            $("#totalFat").text(Math.floor(food.fat));
            $("#fatDaily").text(Math.floor((food.fat * 100) / 80));
            $("#saturedFat").text(Math.floor(food.saturated));
            $("#dailySatFat").text(Math.floor((food.saturated * 100) / 60));
            $("#transFat").text(` 0g`);
            if (food.cholesterol < 1) {
                $("#cholesterol").text(`<   1`);
            } else {
                $("#cholesterol").text(Math.floor(food.cholesterol));
            }
            $("#dailyColesterol").text((Math.floor((food.cholesterol * 100)/300)));
            $("#sodium").text(Math.floor(food.sodium) * 5);
            $("#dalySodium").text(Math.floor(food.sodium));
            $("#carbs").text(Math.floor(food.carbs));
            $("#dalyCarbs").text((Math.floor((food.carbs * 100) / 300)));
            $("#fiber").text(Math.floor(food.dietary_Fiber) * 2);
            $("#dailyFiber").text(Math.floor(food.dietary_Fiber));
            $("#sugars").text(Math.floor(food.sugars));
            $("#protein").text(Math.floor(food.protein));
            $("#vitA").text(Math.floor(food.vitamin_A));
            $("#vitC").text(Math.floor(food.vitamin_C));
            $("#calcium").text(Math.floor(food.calcium));
            if (food.iron < 1) {
                $("#iron").text(`< 1%`);
            } else {
                $("#iron").text(`${Math.floor(food.iron)}%`);
            }
            $("#dailyCaloriesPercent").text(Math.floor((food.calories * 100)/2500));
            $("#dailyCalories").text(Math.floor(food.calories));
            $("#carbsPercentage").text((Math.floor((food.carbs * 100) / 300)));
            $("#carbsInGrams").text(Math.floor(food.carbs));
            $("#fatPercent").text(Math.floor((food.fat * 100) / 80));
            $("#fatInGrams").text(Math.floor(food.fat));
            $("#proteinPercent").text(Math.floor((food.protein * 100)/56));
            $("#proteinInGrams").text(Math.floor(food.protein));
            $("#caloriesToBurn").text(Math.floor(food.calories));
            $("#minutesOfExcersise").text(Math.floor(food.calories * .15));
            $("#minutesOfRunning").text(Math.floor(food.calories * .1));
            $("#minutesOfWalking").text(Math.floor(food.calories * .2));
        });
}