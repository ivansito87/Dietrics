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














const FoodObj = {
     servingSize : 0,
     name : "",
     calories : 0,
     caloriesFromFat : 0,
     carbs : 0,
     dietary_Fiber : 0,
     sugars : 0,
     added_sugars : 0,
     fat : 0,
     fatDaily: 0,
     saturated : 0,
     cholesterol : 0,
     polyunsaturated :0,
     monounsaturated : 0,
     protein : 0,
     sodium : 0,
     potassium : 0,
     vitamin_A : 0,
     vitamin_C : 0,
     vitamin_D : 0,
     calcium : 0,
     iron : 0,
}



    $("#bttonSearch").on("click", (e) => {
        e.preventDefault();
        let userInput = $("#inputSearch").val();
        let userInput2 = userInput;


        //userInput.split(" ").join("%20");
        const searchReqPromise = userInput.split(",").map(function (elt) {
            return searchFood(elt);
        })

        Promise.all(searchReqPromise).then(function(data){
            data.forEach(function(food){
                console.log(food);
                FoodObj.servingSize += 0;
                FoodObj.name += food.name+" ";
                FoodObj.calories += Math.ceil(food.calories);
                FoodObj.caloriesFromFat += Math.ceil(food.caloriesFromFat);
                FoodObj.carbs += 0;
                FoodObj.dietary_Fiber += 0;
                FoodObj.sugars += 0;
                FoodObj.added_sugars += 0;
                FoodObj.fat += Math.ceil(food.fat);
                FoodObj.fatDaily
                FoodObj.saturated += 0;
                FoodObj.cholesterol += 0;
                FoodObj.polyunsaturated +=0;
                FoodObj.monounsaturated += 0;
                FoodObj.protein += 0;
                FoodObj.sodium += 0;
                FoodObj.potassium += 0;
                FoodObj.vitamin_A += 0;
                FoodObj.vitamin_C += 0;
                FoodObj.vitamin_D += 0;
                FoodObj.calcium += 0;
                FoodObj.iron += 0

                
            })
        })







    });

    function renderCharts(arr, arr2) {
        console.log(arr2)
        var ctx = document.getElementById('myChart').getContext('2d');
        var chart = new Chart(ctx, {
            // The type of chart we want to create
            type: 'radar',
            data: {
                labels: ['Carbs', 'Fat', 'Protein'],
                datasets: [{
                    label: 'Recommended',
                    backgroundColor: "rgba(0,255,0,0.2)",
                    borderColor: "rgba(0,255,0,0.2)",
                    borderCapStyle: "rgba(0,255,0,0.2)",
                    data: [
                        100,
                        100,
                        100,
                    ]
                }, {
                    label: 'Your Intake',
                    backgroundColor: "rgba(255,153,51,0.2)",
                    borderColor: "rgba(255,153,51,0.2)",
                    borderCapStyle: "rgba(255,153,51,0.2)",
                    data:
                        arr2

                }]
            },

            // Configuration options go here
            options: {
                responsive: true,
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: 'Macronutrients %'
                },
                maintainAspectRatio: false
            }
        });

        var ctx2 = document.getElementById('myChart2').getContext('2d');
        var chart2 = new Chart(ctx2, {
            type: 'radar',
            data: {
                labels: ['Vitamin A', 'Vitamin C', 'Vitamin B6', 'Vitamin B12', 'Vitamin D', 'Vitamin E', 'Vitamin K', 'Niacin', 'Riboflavin', 'Thiamin', 'Iron', 'Calcium', 'Folate', 'Phosphorus', 'Magnesium', 'Zinc', 'Potassium'],
                datasets: [{
                    label: 'Recommended',
                    backgroundColor: "rgba(0,255,0,0.2)",
                    borderColor: "rgba(0,255,0,0.2)",
                    borderCapStyle: "rgba(0,255,0,0.2)",
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
                    backgroundColor: "rgba(255,153,51,0.2)",
                    borderColor: "rgba(255,153,51,0.2)",
                    borderCapStyle: "rgba(255,153,51,0.2)",
                    data: arr,
                }]
            },

            // Configuration options go here
            options: {
                responsive: true,
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: 'Micronutrients %'
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


});


function searchFood(foodRequest) {
    return $.post("/api/query", { foodRequest })
}

function apiCall(searchQuery) {
    let queryURL = "https://api.edamam.com/api/nutrition-data?app_id=c0bc3d2f&app_key=912969595054b8a128346731ffbf79b3&ingr=" + searchQuery;
    $.get({
        url: queryURL,
        method: "GET",
    }).then((responseFromApi) => {
        console.log(responseFromApi)
        dailyValuesFDA(responseFromApi);


    });
}

function displayNutrition(data) {
    const food = data;
    console.log('foor details');
    console.log(food);
    const foodName = food.name;

    // response from the database query
    $("#servingSize").text(foodName.charAt(0).toUpperCase() + foodName.slice(1));
    $("#calories").text(Math.ceil(food.calories));
    $("#caloriesFromFat").text(Math.ceil(food.caloriesFromFat));
    $("#totalFat").text(Math.ceil(food.fat));
    $("#fatDaily").text(Math.ceil((food.fat * 100) / 80));
    $("#saturedFat").text(Math.ceil(food.saturated));
    $("#dailySatFat").text(Math.ceil((food.saturated * 100) / 60));
    $("#transFat").text(` 0g`);
    if (food.cholesterol < 1) {
        $("#cholesterol").text(`<   1`);
    } else {
        $("#cholesterol").text(Math.ceil(food.cholesterol));
    }
    $("#dailyColesterol").text((Math.ceil((food.cholesterol * 100) / 300)));
    $("#sodium").text(Math.ceil(food.sodium) * 5);
    $("#dalySodium").text(Math.ceil(food.sodium));
    $("#carbs").text(Math.ceil(food.carbs));
    $("#dalyCarbs").text((Math.ceil((food.carbs * 100) / 300)));
    $("#fiber").text(Math.ceil(food.dietary_Fiber) * 2);
    $("#dailyFiber").text(Math.ceil(food.dietary_Fiber));
    $("#sugars").text(Math.ceil(food.sugars));
    $("#protein").text(Math.ceil(food.protein));
    $("#vitA").text(Math.ceil(food.vitamin_A));
    $("#vitC").text(Math.ceil(food.vitamin_C));
    $("#calcium").text(Math.ceil(food.calcium));
    if (food.iron < 1) {
        $("#iron").text(`< 1%`);
    } else {
        $("#iron").text(`${Math.ceil(food.iron)}%`);
    }
    $("#dailyCaloriesPercent").text(Math.ceil((food.calories * 100) / 2500));
    $("#dailyCalories").text(Math.ceil(food.calories));
    $("#carbsPercentage").text((Math.ceil((food.carbs * 100) / 300)));
    $("#carbsInGrams").text(Math.ceil(food.carbs));
    $("#fatPercent").text(Math.ceil((food.fat * 100) / 80));
    $("#fatInGrams").text(Math.ceil(food.fat));
    $("#proteinPercent").text(Math.ceil((food.protein * 100) / 56));
    $("#proteinInGrams").text(Math.ceil(food.protein));
    $("#caloriesToBurn").text(Math.ceil(food.calories));
    $("#minutesOfExcersise").text(Math.ceil(food.calories * .15));
    $("#minutesOfRunning").text(Math.ceil(food.calories * .1));
    $("#minutesOfWalking").text(Math.ceil(food.calories * .2));
}