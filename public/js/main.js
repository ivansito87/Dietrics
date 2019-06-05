
// const loadAuth = (authName) =>{
//     return localStorage.getItem(authName);
//   }
// const saveAuth = (authName, authValue) =>{
//     return localStorage.setItem(authName, authValue);
//   }
  
// const clearAuth = (authName) =>{
//     return localStorage.removeItem(authName);
//   }
$(document).ready(function(){
    let name = loadAuth('name');

    if(name === null){
        window.location.href='/';
    }
    name = name.charAt(0).toUpperCase() + name.slice(1);

    $(".loginAs").text(`Logged In as: ${name}`);

    //sign out
    $(".BtnSignOut").click(function(event){
        $.get('/api/auth/logout')
        .then(function(data, status){
            if(status === 'success'){
                clearAuth('id');
                clearAuth('name');
                clearAuth('token');
                console.log('successfully sign out!');
                window.location.href = '/';
            }
            
        })
        
    })

    //accessing protected data
    // $.ajax({
    //     url:'api/protected/foods',
    //     methods: 'GET'
    // }).done(function(data){
    //     console.log(data);
    // }).fail(function(err){
    //     console.log(err);
    // })


})