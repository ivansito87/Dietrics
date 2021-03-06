const loadAuth = (authName) => {
    return localStorage.getItem(authName);
}
const saveAuth = (authName, authValue) => {
    return localStorage.setItem(authName, authValue);
}

const clearAuth = (authName) => {
    return localStorage.removeItem(authName);
}

$(document).ready(function () {
    //sign up
    $(".btnContact").click(function (event) {
        event.preventDefault();
        const name = $("#name").val();
        const age = $("#age").val();
        const weight = $("#weight").val();
        const height = $("#height").val();
        const gender = $("input[type='radio'][name='gender']:checked").val();
        const isPregnant = ($("input[type='radio'][name='isPregnant']:checked").val() === "true") ? true : false;
        const username = $("#username1").val();
        const password = $("#password1").val();
        const passwordConfirm = $("#passwordConfirm").val();
        console.log(password, passwordConfirm);
        if (password !== passwordConfirm) {
            $(".userError").text("Password not match!");
            console.log('password not match!');
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
            }
            console.log("post checked passed 1");
            console.log(newUser);
            //user validation on empty field and non defined field input. 
            const requiredField = [
                { field: "name", val: name },
                { field: "username1", val: username },
                { field: "password1", val: password },
                { field: "age", val: age },
                { field: "height", val: height },
                { field: "weight", val: weight }];

            let requiredFieldFlag = false;
            requiredField.forEach(field => {
                if (field.val === "" || field === undefined) {
                    requiredFieldFlag = true;
                    $("#" + field.field).prev().css({ "color": "red" });
                    console.log("required field!");
                } else {
                    $("#" + field.field).prev().css({ "color": "#fff" });
                    $(".userError").text("");
                }
            })

            if (requiredFieldFlag) {
                $(".userError").text("Please, fill out all the field");
            } else {
                $.post("/api/user/post", newUser)
                    .then(function (res) {
                        $("#username1").prev().css({ "color": "#fff" });
                        $(".userError").text("");
                        console.log(JSON.stringify(res));
                        $("#username").val(res.username);
                        $("#loginModal").modal({ backdrop: 'static' });


                    })
                    .catch(function (error) {
                        if (error.status == "400") {
                            $("#username1").prev().css({ "color": "red" });
                            $(".userError").text("username already taken!");
                        } else {
                            console.log('Internal Error');
                        }
                    })
            }
        }


    })


    //sign in modal
    $("#signIn").click(function (event) {
        let remUsername2 = localStorage.getItem("remUser");
        console.log(remUsername2);
        if (remUsername2) {
            let remUsername2 = localStorage.getItem("remUser");
            remUsername2 = remUsername2.charAt(0).toUpperCase() + remUsername2.slice(1);
            $("#username").val(remUsername2);

        }
        $("#loginModal").modal({ backdrop: 'static' });
    })

    //sign in
    $(".loginSubmit").click(function (event) {
        event.preventDefault();
        const username = $("#username").val().trim();
        const password = $("#password").val().trim();
        const remUsername = document.getElementById("rememberMe").checked;
        if (remUsername) {
            localStorage.setItem("remUser", username);
        } else {
            localStorage.removeItem("remUser");
        }
        console.log('user is about to loggin!');
        console.log("username: " + username);
        const token = btoa(`${username}:${password}`);
        $.ajax({
            method: 'POST',
            url: '/api/auth/login',
            beforeSend: function (xhr) {
                xhr.setRequestHeader('Authorization', `Basic ${token}`);

            }
        }).done(function (authData) {
            console.log('Successfully login!');
            console.log(authData);
            //save user info to local storage so that your can access it
            saveAuth('id', authData.user.id);
            saveAuth('token', authData.authToken);
            saveAuth('name', authData.user.name);
            $("#loginModal").modal('hide');
            window.location.href = '/main';

        }).fail(function (err) {
            if ((err.status) === 401) {
                console.log('401 error', err.status);
                $(".signError").text('Username or password invalid!');
            } else {
                console.log('500 error', err.status);
                console.log(err);
            }


        });

    })





    const InitialFoodObject = {
        servingSize : " ",
        calories :0,
        caloriesFromFat :0,
        totalFat :0,        
        saturedFat :0,
        dailySatFat : 0,
        fatDaily: 0,     
        transFat : 0,
        cholesterol :0,
        dailyColesterol : 0,
        sodium :0,
        dalySodium :0,
        carbs :0,
        dalyCarbs : 0,
        dailyFiber :0,
        sugars :0,
        protein :0,
        vitA :0,
        vitC :0,
        vitD :0,
        calcium :0,
        iron :0,
        dailyCaloriesPercent : 0,      
        dailyCalories :0,
        carbsPercentage : 0,   
        carbsInGrams :0,
        fatPercent : 0,
        fatInGrams :0,        
        proteinPercent : 0,   
        proteinInGrams :0,
        caloriesToBurn :0,
        minutesOfExcersise :0,
        minutesOfRunning :0,
        minutesOfWalking :0
    }



    $("#bttonSearch").on("click", (e) => {
        e.preventDefault();
        let FoodObj = Object.assign({}, InitialFoodObject);
        let userInput = $("#inputSearch").val();
        let userInput2 = userInput;
        FoodObj.servingSize += userInput;

        //userInput.split(" ").join("%20");
        const searchReqPromise = userInput.split(",").map(function (elt) {
            return searchFood(elt);
        })

        Promise.all(searchReqPromise).then(function (resData) {
            resData.forEach(function (eltFood) {
                console.log(eltFood);
                // response from the database query  
                //FoodObj.servingSize += foodName.charAt(0).toUpperCase() + foodName.slice(1));
                
                FoodObj.calories += Math.ceil(eltFood.calories);
                FoodObj.caloriesFromFat += Math.ceil(eltFood.caloriesFromFat);
                FoodObj.totalFat += Math.ceil(eltFood.fat);
                FoodObj.fatDaily += Math.ceil((eltFood.fat * 100) / 80);
                FoodObj.saturedFat += Math.ceil(eltFood.saturated);
                FoodObj.dailySatFat += Math.ceil((eltFood.saturated * 100) / 60);
                FoodObj.transFat += Math.ceil(eltFood.transFat);
                FoodObj.cholesterol += Math.ceil(eltFood.cholesterol);
                FoodObj.dailyColesterol += (Math.ceil((eltFood.cholesterol * 100) / 300));
                FoodObj.sodium += Math.ceil(eltFood.sodium) * 5;
                FoodObj.dalySodium += Math.ceil(eltFood.sodium);
                FoodObj.carbs += Math.ceil(eltFood.carbs);
                FoodObj.dalyCarbs += (Math.ceil((eltFood.carbs * 100) / 300));
                FoodObj.fiber += Math.ceil(eltFood.dietary_Fiber) * 2;
                FoodObj.dailyFiber += Math.ceil(eltFood.dietary_Fiber);
                FoodObj.sugars += Math.ceil(eltFood.sugars);
                FoodObj.protein += Math.ceil(eltFood.protein);
                FoodObj.vitA += Math.ceil(eltFood.vitamin_A);
                FoodObj.vitC += Math.ceil(eltFood.vitamin_C);
                FoodObj.vitD += Math.ceil(eltFood.vitamin_D);
                FoodObj.calcium += Math.ceil(eltFood.calcium);
                FoodObj.iron += Math.ceil(eltFood.iron);
                FoodObj.dailyCaloriesPercent += Math.ceil((eltFood.calories * 100) / 2500);
                FoodObj.dailyCalories += Math.ceil(eltFood.calories);
                FoodObj.carbsPercentage += (Math.ceil((eltFood.carbs * 100) / 300));
                FoodObj.carbsInGrams += Math.ceil(eltFood.carbs);
                FoodObj.fatPercent += Math.ceil((eltFood.fat * 100) / 80);
                FoodObj.fatInGrams += Math.ceil(eltFood.fat);
                FoodObj.proteinPercent += Math.ceil((eltFood.protein * 100) / 56);
                FoodObj.proteinInGrams += Math.ceil(eltFood.protein);
                FoodObj.caloriesToBurn += Math.ceil(eltFood.calories);
                FoodObj.minutesOfExcersise += Math.ceil(eltFood.calories * .15);
                FoodObj.minutesOfRunning += Math.ceil(eltFood.calories * .1);
                FoodObj.minutesOfWalking += Math.ceil(eltFood.calories * .2);
            });
            displayNutrition(FoodObj);
            
        });
        apiCall(userInput2)

        $("#inputSearch").val("");





    });
    function apiCall(searchQuery) {
        let queryURL = "https://api.edamam.com/api/nutrition-data?app_id=9381544b&app_key=03901b5fa5486a2871d5be06be321a3f&ingr=" + searchQuery;
        $.get({
            url: queryURL,
            method: "GET",
        }).then((responseFromApi) => {
            console.log(responseFromApi)
            dailyValuesFDA(responseFromApi);
    
    
        });
    }

    function renderCharts(arr, arr2) {
        var ctx = document.getElementById('myChart3').getContext('2d');
        var chart = new Chart(ctx, {
            // The type of chart we want to create
            type: 'radar',
            data: {
                labels: ['Carbs', 'Fat', 'Protein'],
                datasets: [{
                    label: 'Recommended',
                    backgroundColor: "rgba(175,217,247,0.42)",
                    borderColor: "rgba(13,15,13,0.2)",
                    borderCapStyle: "rgba(48,123,255,0.26)",
                    data: [
                        100,
                        100,
                        100,
                    ]
                }, {
                    label: 'Your Intake',
                    backgroundColor: "rgba(255,217,128,0.54)",
                    borderColor: "#000",
                    borderCapStyle: "rgba(48,123,255,0.7)",
                    data:
                    arr2

                }]
            },

            // Configuration options go here
            options: {
                scale: {
                    pointLabels: {
                        fontStyle: "bold",
                        fontColor: 'black',
                        fontSize: 15
                    }
                },
                responsive: true,
                legend: {
                    position: 'top',
                    labels: {
                        fontColor: 'black',
                        fontSize: 20
                    }
                },
                title: {
                    display: true,
                    text: 'Macronutrients %',
                    fontColor: 'black',
                    fontSize: 20
                },
                maintainAspectRatio: false
            }
        });

        var ctx2 = document.getElementById('myChart4').getContext('2d');
        var chart2 = new Chart(ctx2, {
            type: 'radar',
            data: {
                labels: ['Vitamin A', 'Vitamin C', 'Vitamin B6', 'Vitamin B12', 'Vitamin D', 'Vitamin E', 'Vitamin K', 'Niacin', 'Riboflavin', 'Thiamin', 'Iron', 'Calcium', 'Folate', 'Phosphorus', 'Magnesium', 'Zinc', 'Potassium'],
                datasets: [{
                    label: 'Recommended',
                    backgroundColor: "rgba(175,217,247,0.5)",
                    borderColor: "rgba(13,15,13,0.93)",
                    borderCapStyle: "rgba(48,123,255,0.2)",
                    data: [
                        100,
                        100,
                        100,
                        100,
                        100,
                        100,
                        100,
                        100,
                        100,
                        100,
                        100,
                        100,
                        100,
                        100,
                        100,
                        100,
                        100
                    ]
                }, {
                    label: 'Your Intake',
                    backgroundColor: "rgba(178,140,255,0.5)",
                    borderColor: "rgba(13,15,13,0.86)",
                    borderCapStyle: "rgba(109,23,203,0.61)",
                    data: arr,
                }]
            },

            // Configuration options go here
            options: {
                responsive: true,
                scale: {
                    pointLabels: {
                        fontColor: 'black',
                        fontStyle: "bold",
                        fontSize: 20
                    }
                },
                legend: {
                    position: 'top',
                    labels: {
                        fontColor: 'black',
                        fontSize: 20,
                    }
                },
                title: {
                    display: true,
                    text: 'Micronutrients %',
                    fontColor: 'black',
                    fontSize: 20
                },
                maintainAspectRatio: false
            }
        });

        //=================================================
        console.log(arr2)
        var ctx = document.getElementById('myChart').getContext('2d');
        var chart = new Chart(ctx, {
            // The type of chart we want to create
            type: 'bar',
            data: {
                labels: ['Carbs', 'Fat', 'Protein'],
                datasets: [{
                    label: 'Recommended Grams',
                    backgroundColor: "#c2a3ff",
                    borderColor: "#2876f9",
                    borderCapStyle: "#2876f9",
                    defaultFontSize: "30",
                    data: [
                        325,
                        50,
                        60,
                    ]
                }, {

                    label: 'Your Intake Grams',
                    backgroundColor: "#68b9f0",
                    borderColor: "rgb(13,15,13)",
                    borderCapStyle: "rgba(255,2,0,0.55)",
                    data: arr2,

                }]
            },

            // Configuration options go here
            options: {
                responsive: true,
                legend: {
                    position: 'bottom',
                    defaultFontSize: 50
                },
                title: {
                    display: true,
                    text: 'Macronutrients Grams'
                },
                titleFontColor: {
                    color: "#fff"
                },
                bodyFontColor: {
                    color: "#fff"
                },
                maintainAspectRatio: false
            }
        });

        var ctx2 = document.getElementById('myChart2').getContext('2d');
        var chart2 = new Chart(ctx2, {
            type: 'bar',
            data: {
                labels: ['Vitamin A', 'Vitamin C', 'Vitamin B6', 'Vitamin B12', 'Vitamin D', 'Vitamin E', 'Vitamin K', 'Niacin', 'Riboflavin', 'Thiamin', 'Iron', 'Calcium', 'Folate', 'Phosphorus', 'Magnesium', 'Zinc', 'Potassium'],
                datasets: [{
                    label: 'Recommended Grams',
                    backgroundColor: "#ff89a2",
                    borderColor: "rgb(0,0,0)",
                    borderCapStyle: "#2876f9",
                    data: [
                        80,
                        70,
                        60,
                        40,
                        30,
                        20,
                        30,
                        60,
                        20,
                        40,
                        30,
                        10,
                        50,
                        35,
                        65,
                        30,
                        80
                    ]
                }, {
                    label: 'Your Intake Grams',
                    backgroundColor: "#78cfcf",
                    borderColor: "rgb(0,0,0)",
                    borderCapStyle: "rgb(0,0,0)",

                    data: arr,
                }]
            },

            // Configuration options go here
            options: {
                responsive: true,
                legend: {
                    position: 'bottom',
                },
                title: {
                    display: true,
                    text: 'Micronutrients Grams'
                },
                maintainAspectRatio: false
            }
        });

    }

    function dailyValuesFDA(res) {
        const id = localStorage.getItem("id");
        console.log(id);
        $.get("/api/user/" + id)
            .then(function (user) {
                console.log(user);
                age = user.age;
                isPregnantCheckedish = user.isPregnant;
                console.log(age);
                console.log(isPregnantCheckedish);
                if (age >= 4 && !isPregnantCheckedish) {
                    return olderThan4(res);
                }

                if (age > 1 && age <= 3) {
                    return between1And3(res);
                }
                if (age <= 1) {
                    return lessThan1(res);
                }

                if (isPregnantCheckedish) {
                    return isPregnant(res);
                }
            });

    }


    function lessThan1(responseFromApi) {
        var vitaminAReq = (responseFromApi.totalNutrients.VITA_RAE ? responseFromApi.totalNutrients.VITA_RAE.quantity : 0) / FDA.youngerThan1.vitA.val * 100;
        var vitaminCReq = (responseFromApi.totalNutrients.VITC ? responseFromApi.totalNutrients.VITC.quantity : 0) / FDA.youngerThan1.vitC.val * 100;
        var vitaminB6Req = (responseFromApi.totalNutrients.VITB6A ? responseFromApi.totalNutrients.VITB6A.quantity : 0) / FDA.youngerThan1.vitB6.val * 100;
        var vitaminB12Req = (responseFromApi.totalNutrients.VITB12 ? responseFromApi.totalNutrients.VITB12.quantity : 0) / FDA.youngerThan1.vitB12.val * 100;
        var vitaminDReq = (responseFromApi.totalNutrients.VITD ? responseFromApi.totalNutrients.VITD.quantity : 0) / FDA.youngerThan1.vitD.val * 100;
        var vitaminEReq = (responseFromApi.totalNutrients.TOCPHA ? responseFromApi.totalNutrients.TOCPHA.quantity : 0) / FDA.youngerThan1.vitE.val * 100;
        var vitaminKReq = (responseFromApi.totalNutrients.VITK1 ? responseFromApi.totalNutrients.VITK1.quantity : 0) / FDA.youngerThan1.vitK.val * 100;
        var niacinReq = (responseFromApi.totalNutrients.NIA ? responseFromApi.totalNutrients.NIA.quantity : 0) / FDA.youngerThan1.niacin.val * 100;
        var riboflavinReq = (responseFromApi.totalNutrients.RIBF ? responseFromApi.totalNutrients.RIBF.quantity : 0) / FDA.youngerThan1.riboflavin.val * 100;
        var thiaminReq = (responseFromApi.totalNutrients.THIA ? responseFromApi.totalNutrients.THIA.quantity : 0) / FDA.youngerThan1.thiamin.val * 100;
        var ironReq = (responseFromApi.totalNutrients.FE ? responseFromApi.totalNutrients.FE.quantity : 0) / FDA.youngerThan1.iron.val * 100;
        var calciumReq = (responseFromApi.totalNutrients.CA ? responseFromApi.totalNutrients.CA.quantity : 0) / FDA.youngerThan1.calcium.val * 100;
        var folateReq = (responseFromApi.totalNutrients.FOLDFE ? responseFromApi.totalNutrients.FOLDFE.quantity : 0) / FDA.youngerThan1.folate.val * 100;
        var phosphorusReq = (responseFromApi.totalNutrients.P ? responseFromApi.totalNutrients.P.quantity : 0) / FDA.youngerThan1.phosphorus.val * 100;
        var magnesiumReq = (responseFromApi.totalNutrients.MG ? responseFromApi.totalNutrients.MG.quantity : 0) / FDA.youngerThan1.magnesium.val * 100;
        var zincReq = (responseFromApi.totalNutrients.ZN ? responseFromApi.totalNutrients.ZN.quantity : 0) / FDA.youngerThan1.zinc.val * 100;
        var potassiumReq = (responseFromApi.totalNutrients.K ? responseFromApi.totalNutrients.K.quantity : 0) / FDA.youngerThan1.potassium.val * 100;
        const arr = [vitaminAReq, vitaminCReq, vitaminB6Req, vitaminB12Req, vitaminDReq, vitaminEReq, vitaminKReq, niacinReq, riboflavinReq, thiaminReq, ironReq, calciumReq, folateReq, phosphorusReq, magnesiumReq, zincReq, potassiumReq];
        const intArr = arr.map(function (i) {
            return parseInt(i)
        })
        var carbPercent = (responseFromApi.totalDaily.CHOCDF ? responseFromApi.totalDaily.CHOCDF.quantity : 0)
        var fatPercent = (responseFromApi.totalDaily.FAT ? responseFromApi.totalDaily.FAT.quantity : 0)
        var proteinPercent = (responseFromApi.totalDaily.PROCNT ? responseFromApi.totalDaily.PROCNT.quantity : 0)
        const arr2 = [carbPercent, fatPercent, proteinPercent];
        const intArr2 = arr2.map(function (i) {
            return parseInt(i)
        })

        renderCharts(intArr, intArr2);
    }

    function between1And3(responseFromApi) {
        var vitaminAReq = (responseFromApi.totalNutrients.VITA_RAE ? responseFromApi.totalNutrients.VITA_RAE.quantity : 0) / FDA.between1and3.vitA.val * 100;
        var vitaminCReq = (responseFromApi.totalNutrients.VITC ? responseFromApi.totalNutrients.VITC.quantity : 0) / FDA.between1and3.vitC.val * 100;
        var vitaminB6Req = (responseFromApi.totalNutrients.VITB6A ? responseFromApi.totalNutrients.VITB6A.quantity : 0) / FDA.between1and3.vitB6.val * 100;
        var vitaminB12Req = (responseFromApi.totalNutrients.VITB12 ? responseFromApi.totalNutrients.VITB12.quantity : 0) / FDA.between1and3.vitB12.val * 100;
        var vitaminDReq = (responseFromApi.totalNutrients.VITD ? responseFromApi.totalNutrients.VITD.quantity : 0) / FDA.between1and3.vitD.val * 100;
        var vitaminEReq = (responseFromApi.totalNutrients.TOCPHA ? responseFromApi.totalNutrients.TOCPHA.quantity : 0) / FDA.between1and3.vitE.val * 100;
        var vitaminKReq = (responseFromApi.totalNutrients.VITK1 ? responseFromApi.totalNutrients.VITK1.quantity : 0) / FDA.between1and3.vitK.val * 100;
        var niacinReq = (responseFromApi.totalNutrients.NIA ? responseFromApi.totalNutrients.NIA.quantity : 0) / FDA.between1and3.niacin.val * 100;
        var riboflavinReq = (responseFromApi.totalNutrients.RIBF ? responseFromApi.totalNutrients.RIBF.quantity : 0) / FDA.between1and3.riboflavin.val * 100;
        var thiaminReq = (responseFromApi.totalNutrients.THIA ? responseFromApi.totalNutrients.THIA.quantity : 0) / FDA.between1and3.thiamin.val * 100;
        var ironReq = (responseFromApi.totalNutrients.FE ? responseFromApi.totalNutrients.FE.quantity : 0) / FDA.between1and3.iron.val * 100;
        var calciumReq = (responseFromApi.totalNutrients.CA ? responseFromApi.totalNutrients.CA.quantity : 0) / FDA.between1and3.calcium.val * 100;
        var folateReq = (responseFromApi.totalNutrients.FOLDFE ? responseFromApi.totalNutrients.FOLDFE.quantity : 0) / FDA.between1and3.folate.val * 100;
        var phosphorusReq = (responseFromApi.totalNutrients.P ? responseFromApi.totalNutrients.P.quantity : 0) / FDA.between1and3.phosphorus.val * 100;
        var magnesiumReq = (responseFromApi.totalNutrients.MG ? responseFromApi.totalNutrients.MG.quantity : 0) / FDA.between1and3.magnesium.val * 100;
        var zincReq = (responseFromApi.totalNutrients.ZN ? responseFromApi.totalNutrients.ZN.quantity : 0) / FDA.between1and3.zinc.val * 100;
        var potassiumReq = (responseFromApi.totalNutrients.K ? responseFromApi.totalNutrients.K.quantity : 0) / FDA.between1and3.potassium.val * 100;
        const arr = [vitaminAReq, vitaminCReq, vitaminB6Req, vitaminB12Req, vitaminDReq, vitaminEReq, vitaminKReq, niacinReq, riboflavinReq, thiaminReq, ironReq, calciumReq, folateReq, phosphorusReq, magnesiumReq, zincReq, potassiumReq];
        const intArr = arr.map(function (i) {
            return parseInt(i)
        })
        var carbPercent = (responseFromApi.totalDaily.CHOCDF ? responseFromApi.totalDaily.CHOCDF.quantity : 0)
        var fatPercent = (responseFromApi.totalDaily.FAT ? responseFromApi.totalDaily.FAT.quantity : 0)
        var proteinPercent = (responseFromApi.totalDaily.PROCNT ? responseFromApi.totalDaily.PROCNT.quantity : 0)
        const arr2 = [carbPercent, fatPercent, proteinPercent];
        const intArr2 = arr2.map(function (i) {
            return parseInt(i)
        })

        renderCharts(intArr, intArr2);
    }

    function olderThan4(responseFromApi) {
        var vitaminAReq = (responseFromApi.totalNutrients.VITA_RAE ? responseFromApi.totalNutrients.VITA_RAE.quantity : 0) / FDA.olderThan4.vitA.val * 100;
        var vitaminCReq = (responseFromApi.totalNutrients.VITC ? responseFromApi.totalNutrients.VITC.quantity : 0) / FDA.olderThan4.vitC.val * 100;
        var vitaminB6Req = (responseFromApi.totalNutrients.VITB6A ? responseFromApi.totalNutrients.VITB6A.quantity : 0) / FDA.olderThan4.vitB6.val * 100;
        var vitaminB12Req = (responseFromApi.totalNutrients.VITB12 ? responseFromApi.totalNutrients.VITB12.quantity : 0) / FDA.olderThan4.vitB12.val * 100;
        var vitaminDReq = (responseFromApi.totalNutrients.VITD ? responseFromApi.totalNutrients.VITD.quantity : 0) / FDA.olderThan4.vitD.val * 100;
        var vitaminEReq = (responseFromApi.totalNutrients.TOCPHA ? responseFromApi.totalNutrients.TOCPHA.quantity : 0) / FDA.olderThan4.vitE.val * 100;
        var vitaminKReq = (responseFromApi.totalNutrients.VITK1 ? responseFromApi.totalNutrients.VITK1.quantity : 0) / FDA.olderThan4.vitK.val * 100;
        var niacinReq = (responseFromApi.totalNutrients.NIA ? responseFromApi.totalNutrients.NIA.quantity : 0) / FDA.olderThan4.niacin.val * 100;
        var riboflavinReq = (responseFromApi.totalNutrients.RIBF ? responseFromApi.totalNutrients.RIBF.quantity : 0) / FDA.olderThan4.riboflavin.val * 100;
        var thiaminReq = (responseFromApi.totalNutrients.THIA ? responseFromApi.totalNutrients.THIA.quantity : 0) / FDA.olderThan4.thiamin.val * 100;
        var ironReq = (responseFromApi.totalNutrients.FE ? responseFromApi.totalNutrients.FE.quantity : 0) / FDA.olderThan4.iron.val * 100;
        var calciumReq = (responseFromApi.totalNutrients.CA ? responseFromApi.totalNutrients.CA.quantity : 0) / FDA.olderThan4.calcium.val * 100;
        var folateReq = (responseFromApi.totalNutrients.FOLDFE ? responseFromApi.totalNutrients.FOLDFE.quantity : 0) / FDA.olderThan4.folate.val * 100;
        var phosphorusReq = (responseFromApi.totalNutrients.P ? responseFromApi.totalNutrients.P.quantity : 0) / FDA.olderThan4.phosphorus.val * 100;
        var magnesiumReq = (responseFromApi.totalNutrients.MG ? responseFromApi.totalNutrients.MG.quantity : 0) / FDA.olderThan4.magnesium.val * 100;
        var zincReq = (responseFromApi.totalNutrients.ZN ? responseFromApi.totalNutrients.ZN.quantity : 0) / FDA.olderThan4.zinc.val * 100;
        var potassiumReq = (responseFromApi.totalNutrients.K ? responseFromApi.totalNutrients.K.quantity : 0) / FDA.olderThan4.potassium.val * 100;
        const arr = [vitaminAReq, vitaminCReq, vitaminB6Req, vitaminB12Req, vitaminDReq, vitaminEReq, vitaminKReq, niacinReq, riboflavinReq, thiaminReq, ironReq, calciumReq, folateReq, phosphorusReq, magnesiumReq, zincReq, potassiumReq];
        const intArr = arr.map(function (i) {
            return parseInt(i)
        })

        var carbPercent = (responseFromApi.totalDaily.CHOCDF ? responseFromApi.totalDaily.CHOCDF.quantity : 0)
        var fatPercent = (responseFromApi.totalDaily.FAT ? responseFromApi.totalDaily.FAT.quantity : 0)
        var proteinPercent = (responseFromApi.totalDaily.PROCNT ? responseFromApi.totalDaily.PROCNT.quantity : 0)
        const arr2 = [carbPercent, fatPercent, proteinPercent];
        const intArr2 = arr2.map(function (i) {
            return parseInt(i)
        })
        console.log("ran this");
        renderCharts(intArr, intArr2);
    }


    function isPregnant(responseFromApi) {
        var vitaminAReq = (responseFromApi.totalNutrients.VITA_RAE ? responseFromApi.totalNutrients.VITA_RAE.quantity : 0) / FDA.pregnantWomen.vitA.val * 100;
        var vitaminCReq = (responseFromApi.totalNutrients.VITC ? responseFromApi.totalNutrients.VITC.quantity : 0) / FDA.pregnantWomen.vitC.val * 100;
        var vitaminB6Req = (responseFromApi.totalNutrients.VITB6A ? responseFromApi.totalNutrients.VITB6A.quantity : 0) / FDA.pregnantWomen.vitB6.val * 100;
        var vitaminB12Req = (responseFromApi.totalNutrients.VITB12 ? responseFromApi.totalNutrients.VITB12.quantity : 0) / FDA.pregnantWomen.vitB12.val * 100;
        var vitaminDReq = (responseFromApi.totalNutrients.VITD ? responseFromApi.totalNutrients.VITD.quantity : 0) / FDA.pregnantWomen.vitD.val * 100;
        var vitaminEReq = (responseFromApi.totalNutrients.TOCPHA ? responseFromApi.totalNutrients.TOCPHA.quantity : 0) / FDA.pregnantWomen.vitE.val * 100;
        var vitaminKReq = (responseFromApi.totalNutrients.VITK1 ? responseFromApi.totalNutrients.VITK1.quantity : 0) / FDA.pregnantWomen.vitK.val * 100;
        var niacinReq = (responseFromApi.totalNutrients.NIA ? responseFromApi.totalNutrients.NIA.quantity : 0) / FDA.pregnantWomen.niacin.val * 100;
        var riboflavinReq = (responseFromApi.totalNutrients.RIBF ? responseFromApi.totalNutrients.RIBF.quantity : 0) / FDA.pregnantWomen.riboflavin.val * 100;
        var thiaminReq = (responseFromApi.totalNutrients.THIA ? responseFromApi.totalNutrients.THIA.quantity : 0) / FDA.pregnantWomen.thiamin.val * 100;
        var ironReq = (responseFromApi.totalNutrients.FE ? responseFromApi.totalNutrients.FE.quantity : 0) / FDA.pregnantWomen.iron.val * 100;
        var calciumReq = (responseFromApi.totalNutrients.CA ? responseFromApi.totalNutrients.CA.quantity : 0) / FDA.pregnantWomen.calcium.val * 100;
        var folateReq = (responseFromApi.totalNutrients.FOLDFE ? responseFromApi.totalNutrients.FOLDFE.quantity : 0) / FDA.pregnantWomen.folate.val * 100;
        var phosphorusReq = (responseFromApi.totalNutrients.P ? responseFromApi.totalNutrients.P.quantity : 0) / FDA.pregnantWomen.phosphorus.val * 100;
        var magnesiumReq = (responseFromApi.totalNutrients.MG ? responseFromApi.totalNutrients.MG.quantity : 0) / FDA.pregnantWomen.magnesium.val * 100;
        var zincReq = (responseFromApi.totalNutrients.ZN ? responseFromApi.totalNutrients.ZN.quantity : 0) / FDA.pregnantWomen.zinc.val * 100;
        var potassiumReq = (responseFromApi.totalNutrients.K ? responseFromApi.totalNutrients.K.quantity : 0) / FDA.pregnantWomen.potassium.val * 100;
        const arr = [vitaminAReq, vitaminCReq, vitaminB6Req, vitaminB12Req, vitaminDReq, vitaminEReq, vitaminKReq, niacinReq, riboflavinReq, thiaminReq, ironReq, calciumReq, folateReq, phosphorusReq, magnesiumReq, zincReq, potassiumReq];
        const intArr = arr.map(function (i) {
            return parseInt(i)
        })
        var carbPercent = (responseFromApi.totalDaily.CHOCDF ? responseFromApi.totalDaily.CHOCDF.quantity : 0)
        var fatPercent = (responseFromApi.totalDaily.FAT ? responseFromApi.totalDaily.FAT.quantity : 0)
        var proteinPercent = (responseFromApi.totalDaily.PROCNT ? responseFromApi.totalDaily.PROCNT.quantity : 0)
        const arr2 = [carbPercent, fatPercent, proteinPercent];
        const intArr2 = arr2.map(function (i) {
            return parseInt(i)
        })
        console.log("ran this");
        renderCharts(intArr, intArr2);
    }


    $('.contact-form').find('.form-control').focus(function() {
        $(this).parent('.input-block').addClass('focus');
        $(this).parent().find('label').animate({
            'top': '10px',
            'fontSize': '14px'
        }, 300);
    });

});


function searchFood(foodRequest) {
    return $.post("/api/query", { foodRequest })
}



function displayNutrition(food) {
    // response from the database query
    $("#servingSize").text(food.servingSize);
    $("#calories").text(food.calories);
    $("#caloriesFromFat").text(food.caloriesFromFat);
    $("#totalFat").text(food.totalFat);
    $("#fatDaily").text(food.fatDaily );
    $("#saturedFat").text(food.saturedFat);
    $("#dailySatFat").text(food.dailySatFat);
    $("#transFat").text(food.transFat);
    if (food.cholesterol < 1) {
        $("#cholesterol").text(`<   1`);
    } else {
        $("#cholesterol").text(food.cholesterol);
    }
    $("#dailyColesterol").text(food.dailyColesterol );
    $("#sodium").text(food.sodium);
    $("#dalySodium").text(food.dalySodium);
    $("#carbs").text(food.carbs);
    $("#dalyCarbs").text(food.dalyCarbs);
    $("#fiber").text(food.dailyFiber);
    $("#dailyFiber").text(food.dailyFiber);
    $("#sugars").text(food.sugars);
    $("#protein").text(food.protein);
    $("#vitA").text(food.vitA);
    $("#vitC").text(food.vitC);
    $("#vitD").text(food.vitD);
    $("#calcium").text(food.calcium);
    if (food.iron < 1) {
        $("#iron").text(`< 1%`);
    } else {
        $("#iron").text(`${food.iron}%`);
    }
    $("#dailyCaloriesPercent").text(food.dailyCaloriesPercent);
    $("#dailyCalories").text(food.dailyCalories);
    $("#carbsPercentage").text(food.carbsPercentage);
    $("#carbsInGrams").text(food.carbsInGrams);
    $("#fatPercent").text(food.fatPercent);
    $("#fatInGrams").text(food.fatInGrams);
    $("#proteinPercent").text(food.proteinPercent);
    $("#proteinInGrams").text(food.proteinInGrams);
    $("#caloriesToBurn").text(food.caloriesToBurn);
    $("#minutesOfExcersise").text(food.minutesOfExcersise );
    $("#minutesOfRunning").text(food.minutesOfRunning );
    $("#minutesOfWalking").text(food.minutesOfWalking );
}

