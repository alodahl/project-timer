"use strict";


$('.timer-section').on('click', '.timer-button', function(event) {
var start = new Date;

setInterval(function(event) {
    $('.timer-button').text(Math.round((new Date - start) / 1000)+ "s");
}, 1000);

})
