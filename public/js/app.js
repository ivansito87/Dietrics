$( document ).ready(function() {
  $(".btnContact").click(function(event){
      event.preventDefault();
      alert("clicked");
      const name = $("#name").val();
      const age = $("#age").val();
      const weight = $("#weight").val();
      const height = $("#height").val();
      const gender = $("input[type='radio'][name='gender']:checked").val();
      const isPregnant = ($("input[type='radio'][name='isPregnant']:checked").val() === "true")? true: false; 
      const username = $("#username").val();
      const email = $("#email").val();
      const password = $("#password").val();
      const passwordConfirm = $("#passwordConfirm").val();
      if(password !== passwordConfirm){
          console.log('passport not match!');
      }else{
        const newUser = {
            name: name,
            username: username,
            email: email,
            password: password,
            age: age,
            gender: gender,
            height: height,
            weight: weight,
            isPregnant: isPregnant
        }
    
        $.post("/api/post", newUser).then(function(data){
            console.log('successfully add a new user' + data);
        })
      }

     
      
      
    
      

    


  })  


});

