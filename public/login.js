'use strict';

function logUserIn(userData) {
  const settings = {
    url: '/auth/login',
    data: userData,
    dataType: 'json',
    type: 'POST',
    success: function(data) {
      localStorage.setItem('token', data.authToken);
      localStorage.setItem('user', userData.username);
      window.location.href = '/dashboard.html';
    },
    error: function(data) {
      console.log("Error: user authentication failed.");
      alert("Error: Incorrect name and password combination");
    }
  };
  $.ajax(settings);
}

$('.js-login-form').submit( function(event) {
  event.preventDefault()
  let userData = {
    username: $('.js-login-username').val(),
    password: $('.js-login-password').val(),
  };
  logUserIn(userData);
})
