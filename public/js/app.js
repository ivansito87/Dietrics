$( document ).ready(function() {
  $("#btnSubmit").click(function(event){
      event.preventDefault();
      alert("clicked");
      const name = $("#name").val();
      const age = $("#age").val();
      const weight = $("#weight").val();
      const height = $("#height").val();
      const gender = $("input[type='radio'][name='optradio']:checked").val();

      $.post("/api/post", newUser).then(function(data){
          console.log('successfully add a new user');
      })
      
      const newUser= {
          name: name,
          username: "",
          password: "",
          age: age,
          weight: weight,
          height: height,
          gender: gender,
          isPregnant: false
    }
    
      

    


  })  


});

