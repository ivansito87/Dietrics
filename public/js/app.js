
$( document ).ready(function() {
  $(".btnContact").click(function(event){
      event.preventDefault();
      const name = $("#name").val();
      const age = $("#age").val();
      const weight = $("#weight").val();
      const height = $("#height").val();
      const gender = $("input[type='radio'][name='gender']:checked").val();
      const isPregnant = ($("input[type='radio'][name='isPregnant']:checked").val() === "true")? true: false; 
      const username = $("#username").val();
      const password = $("#password").val();
      const passwordConfirm = $("#passwordConfirm").val();
      if(password !== passwordConfirm){
        $(".userError").text("Password not match!");
      }else{
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
    //user validation on empty field and non defined field input. 
        const requiredField = [
            {field: "name", val: name}, 
            {field: "username", val: username},  
            {field: "password", val: password},
            {field: "age", val: age},
            { field: "height", val: height},
            { field: "weight", val: weight} ];

        let requiredFieldFlag = false;
        requiredField.forEach(field => {
            if(field.val === "" || field === undefined){
                requiredFieldFlag = true;
                $("#"+field.field).addClass("error");
            }else{
                $("#"+field.field).removeClass("error");
            } 
        })

        if(requiredFieldFlag){
            $(".userError").text("Fill all the field below!");
        }else{
            $.post("/api/post", newUser)
            .then(function(res){
                $("#username").removeClass("error");
                $(".userError").text();
                console.log(JSON.stringify(res));
                //redirect to user account
                
            })
            .catch(function(error){
                //console.log("error: ");
                //console.log(error);
                //$("#username").prepend(`<p class="text-danger">username already taken</p>`);
                if(error.status == "400"){
                    $("#username").addClass("error");
                    $(".userError").text("username already taken!");
                }else{
                    console.log('Internal Error');
                }
                
               
                
            })
        }
      }


  })  

  $(".btnLoginSignUp").click(function(event){
      $("#loginModal").modal('toggle');

  })


















  $("#bttonSearch").on("click", (e) => {
    e.preventDefault();
    let userInput = $("#inputSearch").val();

    // let thing = "one cup of rice";
        userInput.split(" ").join("%20");
    let queryURL = "https://api.edamam.com/api/nutrition-data?app_id=c0bc3d2f&app_key=912969595054b8a128346731ffbf79b3&ingr=" + userInput;
   $.get({
       url: queryURL,
       method: "GET",
   }).then((responseFromApi) => {
       console.log(responseFromApi)
   });



  

});
});
