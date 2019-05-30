
function isValidField(requiredField){
    const missingField = requiredField.find(field => field === "" );
      console.log('missingField='+missingField)
      console.log(requiredField)
      if (missingField == "") {
          return false;
      }else{
        return true;
      }
  }

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
        
        const requiredField = [
            {field: "name", val: name}, 
            {field: "username", val: username}, 
            {field: "email", val: email}, 
            {field: "password", val: password},
            {field: "age", val: age},
            { field: "height", val: height},
            { field: "weight", val: weight} ];

        let requiredFieldFlag = false;
        requiredField.forEach(field => {
            if(field.val === ""){
                requiredFieldFlag = true;
                $("#"+field.field).addClass("error");
            }else{
                $("#"+field.field).removeClass("error");
            } 
        })

        if(requiredFieldFlag){
            alert('Fill all the form!');
        }else{
            $.post("/api/post", newUser).then(function(res){
                console.log(res.status);
                
            })
        }
      }

     
      
      
    
      

    


  })  


});

