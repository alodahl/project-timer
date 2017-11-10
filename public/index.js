"use strict";

let timers = [];
let newTimerForm = `<form class="edit-form" action="" method="">
  <label for="project name">Project Name:</label>
  <input type="text" name="project name" value="" placeholder="PASTEL LANDSCAPE">
  <label for="category">Category:</label>
  <input type="text" name="category" value="" placeholder="art">
  <label for="start date">Start Date:</label>
  <input type="text" name="start date" value="" placeholder="optional">
  <label for="notes">Notes:</label>
  <input type="text" name="notes" value="" placeholder="chalk pastels, 400lb cold-pressed paper">
  <label for="other time">Do you need to manually add time spent on your project?</label>
  <input type="text" name="other time" value="" placeholder="hours"><input type="text" name="other time" value="" placeholder="minutes">
  <button class="form-button" type="submit" name="button">save changes</button>
</form>`

//calling newTimer pushes a new timer object
//to the timers array
function newTimer(name) {
  let newTimer = {
  label: name || "NEW PROJECT",
  totalTime: 0,
  todaysTime: 0,
  isRunning: false,
  intervalTicker: null
  }
  timers.push(newTimer);
};

//formats seconds into HOUR:MIN:SEC
const formatSeconds = (seconds) => {
  var date = new Date(null);
  date.setSeconds(seconds);
  return date.toISOString().substr(11, 8);
}

//formats seconds into 00h 00m
const formatHoursAndMinutes = (seconds) => {
  var date = new Date(null);
  date.setSeconds(seconds);
  let hours = date.toISOString().substr(11, 2);
  let min = date.toISOString().substr(14, 2);
  return `${hours}h ${min}m`;
}

//makes one new blank timer with an id of it's index in the timers array
const renderTimerComponent = function (timer, index) {
  let part1ofTimer = `<div class="timer" data-index="${index}">
    <div class="timer-info">
      <h3 class="timer-label">${timer.label}</h3>
      <p class="timer-stats">Today's Total:${formatHoursAndMinutes(timer.todaysTime)}</p>
      <p class="timer-stats">Project Total: ${formatHoursAndMinutes(timer.totalTime)}</p>
    </div>`;
  let part2ofStoppedTimer = `<div class="timer-button button" data-id="${index}">${formatSeconds(timer.todaysTime)}</div>
    </div>`;
  let part2ofRunningTimer = `<div class="timer-button button green-button" data-id="${index}">${formatSeconds(timer.todaysTime)}</div>
    </div>`;

  if (!timer.isRunning) {
    return (`${part1ofTimer}${part2ofStoppedTimer}`);
  } else {
    return (`${part1ofTimer}${part2ofRunningTimer}`);
  }
}

//render each object in timers array by passing values into a
// html block and then appending that to the dom.
function renderTimers(timers) {
  $('.js-timer-section').html('');
  for(let i=0; i < timers.length; i++) {
    let index = i;
    let timer = timers[i];
    $('.js-timer-section').append(renderTimerComponent(timer, index));
  }
}

//listener for square timer button. on click, if it was off, it turns on timer and adds
//1 to the totalTime and todaysTime every second. If it was on, it should stop the timer.
$('.js-timer-section').on('click', '.timer-button', function(event) {
  var start = new Date;
  let id = $(this).attr('data-id');
  let clickedTimer = timers[id];
  console.log(this);
  if (!clickedTimer.isRunning) {
    clickedTimer.isRunning = true;
    clickedTimer.intervalTicker = setInterval(function(event) {
        clickedTimer.todaysTime += 1;
        clickedTimer.totalTime += 1;
        renderTimers(timers);
    }, 1000);
  } else {
    clickedTimer.isRunning = false;
    setTimeout(function( ) { clearInterval(clickedTimer.intervalTicker) }, 1000);;
  }
  console.log(`timer ${id}`)
})

//when "new timer" area is clicked, add a new object to timers array
//with newTimer function and re-render the whole array of timers.
// Then open a modal with user customization options,
// hiding main content.
$('.js-new-timer-button').on('click', function() {
  $('.js-modal-content').html(newTimerForm);
  $('.js-modal').removeClass("hidden");
  $('header').attr("aria-hidden", "true");
  $('main').attr("aria-hidden", "true");
  $('footer').attr("aria-hidden", "true");
  newTimer();
  renderTimers(timers);
})

//click close button to hide modal and show results page
$('.close-button').on('click', function(event) {
  $('.js-modal').addClass("hidden");
  $('header').attr("aria-hidden", "false");
  $('main').attr("aria-hidden", "false");
  $('footer').attr("aria-hidden", "false");
})

//click outside of light modal to hide modal and return to results page
$('.dark').on('click', function(event) {
  $('.js-modal').addClass("hidden");
  $('header').attr("aria-hidden", "false");
  $('main').attr("aria-hidden", "false");
  $('footer').attr("aria-hidden", "false");
})

//render existing timers on page load
newTimer("WATERCOLOR PAINTING");
newTimer("FINISH CODING SERVER");
renderTimers(timers);
