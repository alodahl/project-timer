'use strict';

function createNewUser(userData) {
  const settings = {
    url: '/users/',
    data: userData,
    dataType: 'json',
    type: 'POST',
    success: function(user) {
      console.log(`User /"${user.username}/" has been created!`);
      window.location.href = "login.html";
    },
    error: function(data) {
      console.log("Error: API could not create a new user.", data);
    }
  };
  $.ajax(settings);
}

$('.js-signup-form').submit( function(event) {
  event.preventDefault()
  console.log("signup button clicked");
  let newUserData = {
    username: $('.js-signup-username').val(),
    password: $('.js-signup-password').val(),
    confirmPassword: $('.js-signup-confirm-password').val(),
  };


  createNewUser(newUserData);
})
