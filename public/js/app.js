$( document ).ready(function() {
  $("#btnSubmit").click(function(event){
      event.preventDefault();
      alert("clicked");
  });  



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
