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
                { field: "name", val: name },
                { field: "username", val: username },
                { field: "password", val: password },
                { field: "age", val: age },
                { field: "height", val: height },
                { field: "weight", val: weight }];

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
        let queryURL = "https://api.edamam.com/api/nutrition-data?app_id=c0bc3d2f&app_key=912969595054b8a128346731ffbf79b3&ingr=" + userInput;
        $.get({
            url: queryURL,
            method: "GET",
        }).then((responseFromApi) => {
            console.log(responseFromApi)
            dailyValuesFDA(responseFromApi);


        });


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
                    backgroundColor: "rgba(51,255,0,0.2)",
                    borderColor: "rgba(220,220,220,1)",
                    borderCapStyle: "rgba(220,220,220,1)",    
                    data: [
                        100,
                        100,
                        100,
                    ]
                }, {
                    label: 'Your Intake',
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

        $.get("/api/profiles", function (data) {
            var age = 0;
            for (var i = 0; i < data.length; i++) {
                if ("Miles" === data[i].name) {
                    age = data[i].age;
                    isPregnant = data[i].isPregnant;
                    if (age >= 4 && !isPregnant) {
                        return olderThan4(res);
                    }

                    if (age > 1 && age <= 3) {
                        return between1And3(res);
                    }
                    if (age <= 1) {
                        return lessThan1(res);
                  }
      
                    if (isPregnant) {
                        return isPregnant(res);
                    }
                }
            }

        })
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
        var carbPercent = (responseFromApi.totalDaily.CHOCDF.quantity)
        var fatPercent = (responseFromApi.totalDaily.FAT.quantity)
        var proteinPercent = (responseFromApi.totalDaily.PROCNT.quantity)
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
        var carbPercent = (responseFromApi.totalDaily.CHOCDF.quantity)
        var fatPercent = (responseFromApi.totalDaily.FAT.quantity)
        var proteinPercent = (responseFromApi.totalDaily.PROCNT.quantity)
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
        var carbPercent = (responseFromApi.totalDaily.CHOCDF.quantity)
        var fatPercent = (responseFromApi.totalDaily.FAT.quantity)
        var proteinPercent = (responseFromApi.totalDaily.PROCNT.quantity)
        const arr2 = [carbPercent, fatPercent, proteinPercent];
        const intArr2 = arr2.map(function (i) {
            return parseInt(i)
        })

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
        var carbPercent = (responseFromApi.totalDaily.CHOCDF.quantity)
        var fatPercent = (responseFromApi.totalDaily.FAT.quantity)
        var proteinPercent = (responseFromApi.totalDaily.PROCNT.quantity)
        const arr2 = [carbPercent, fatPercent, proteinPercent];
        const intArr2 = arr2.map(function (i) {
            return parseInt(i)
        })

        renderCharts(intArr, intArr2);
    }


});
