'use strict';

function logUserIn(userData) {
  const settings = {
    url: '/auth/login',
    data: userData,
    dataType: 'json',
    type: 'POST',
<<<<<<< HEAD
    success: function(user) {
      window.location.href = './dashboard.html';
=======
    success: function(data) {
      localStorage.setItem('token', data.authToken);
>>>>>>> 50f80cd4ed8287c36f64fe87961931881d1bf1f4
      console.log("You are logged in.", data);
      window.location.href = '/dashboard.html';
    },
    error: function(data) {
      console.log("Error: user authentication failed.", data);
    }
  };
  $.ajax(settings);
}

$('.js-login-form').submit( function(event) {
  event.preventDefault()
  console.log("signup button clicked");
  let userData = {
    username: $('.js-login-username').val(),
    password: $('.js-login-password').val(),
  };
  logUserIn(userData);
})
