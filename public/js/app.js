const loadAuth = (authName) =>{
    return localStorage.getItem(authName);
  }
const saveAuth = (authName, authValue) =>{
    return localStorage.setItem(authName, authValue);
  }
  
const clearAuth = (authName) =>{
    return localStorage.removeItem(authName);
  }

$( document ).ready(function() {
    //sign up
  $(".btnContact").click(function(event){
      event.preventDefault();
      const name = $("#name").val();
      const age = $("#age").val();
      const weight = $("#weight").val();
      const height = $("#height").val();
      const gender = $("input[type='radio'][name='gender']:checked").val();
      const isPregnant = ($("input[type='radio'][name='isPregnant']:checked").val() === "true")? true: false; 
      const username = $("#username1").val();
      const password = $("#password1").val();
      const passwordConfirm = $("#passwordConfirm").val();
      console.log(password, passwordConfirm);
      if(password !== passwordConfirm){
        $(".userError").text("Password not match!");
        console.log('password not match!');
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
        console.log("post checked passed 1");
        console.log(newUser);
    //user validation on empty field and non defined field input. 
        const requiredField = [
            {field: "name", val: name}, 
            {field: "username1", val: username},  
            {field: "password1", val: password},
            {field: "age", val: age},
            { field: "height", val: height},
            { field: "weight", val: weight} ];

        let requiredFieldFlag = false;
        requiredField.forEach(field => {
            if(field.val === "" || field === undefined){
                requiredFieldFlag = true;
                $("#"+field.field).prev().css({"color": "red"});
                console.log("required field!");
            }else{
                $("#"+field.field).prev().css({"color": "#fff"});
                $(".userError").text("");
            } 
        })

        if(requiredFieldFlag){
            $(".userError").text("Please, fill out all the field");
        }else{
            $.post("/api/user/post", newUser)
            .then(function(res){
                $("#username1").prev().css({"color": "#fff"});
                $(".userError").text("");
                console.log(JSON.stringify(res));
                $("#username").val(res.username);
                $("#loginModal").modal({backdrop: 'static'});


            })
            .catch(function(error){
                if(error.status == "400"){
                    $("#username1").prev().css({"color": "red"});
                    $(".userError").text("username already taken!");
                }else{
                    console.log('Internal Error');
                }   
            })
        }
      }


  })  


  //sign in modal
  $("#signIn").click(function(event){
      let remUsername2 = localStorage.getItem("remUser");
      console.log(remUsername2);
      if(remUsername2){
          $("#username").val(remUsername2);
      }
      $("#loginModal").modal({backdrop: 'static'});
  })

  //sign in
  $(".loginSubmit").click(function(event){
      event.preventDefault();
      const username = $("#username").val().trim();
      const password = $("#password").val().trim();
      const remUsername = document.getElementById("rememberMe").checked;
      if(remUsername){
          localStorage.setItem("remUser", username);
      }else{
        localStorage.removeItem("remUser");
      }
      console.log('user is about to loggin!');
      console.log("username: "+username);
      const token = btoa(`${username}:${password}`);
      $.ajax({
          method:'POST',
          url: '/api/auth/login',
          beforeSend: function(xhr){
              xhr.setRequestHeader('Authorization', `Basic ${token}`);
              
          }
        }).done(function(authData){
            console.log('Successfully login!');
            console.log(authData);
            //save user info to local storage so that your can access it
            saveAuth('id', authData.user.id);
            saveAuth('token', authData.authToken);
            saveAuth('name', authData.user.name);
            $("#loginModal").modal('hide');
            window.location.href='/main'; 
            
        }).fail(function(err){
            if((err.status) === 401){
                console.log('401 error', err.status);
                $(".signError").text('Username or password invalid!');
            }else{
                console.log('500 error', err.status);
                console.log(err);
            }
            
          
        });
      
  })


















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
        });

    });
});
