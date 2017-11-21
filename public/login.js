'use strict';

function logUserIn(userData) {
  const settings = {
    url: '/auth/login',
    data: userData,
    dataType: 'json',
    type: 'POST',
    success: function(data) {
      localStorage.setItem('token', data.authToken);
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
