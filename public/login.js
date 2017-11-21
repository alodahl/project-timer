'use strict';

function logUserIn(userData) {
  const settings = {
    url: '/auth/login',
    data: userData,
    dataType: 'json',
    type: 'POST',
    success: function(user) {
      window.location.href = './dashboard.html';
      console.log("You are logged in.", data);
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
