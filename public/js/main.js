
const loadAuth = (authName) =>{
    return localStorage.getItem(authName);
  }
const saveAuth = (authName, authValue) =>{
    return localStorage.setItem(authName, authValue);
  }
  
const clearAuth = (authName) =>{
    return localStorage.removeItem(authName);
  }
$(document).ready(function(){
    const name = loadAuth('name');

    $(".loginAs").text(`Loged In as: ${name}`);

    $(".BtnSignOut").click(function(event){
        clearAuth('id');
        clearAuth('name');
        clearAuth('token');
        window.location.href = '/';
    })


})