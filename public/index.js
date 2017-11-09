"use strict";

//formats seconds into HOUR:MIN:SEC
const formatSeconds = (seconds) => {
  var date = new Date(null);
  date.setSeconds(seconds); // specify value for SECONDS here
  return date.toISOString().substr(11, 8);
}

// const formatMinutes = (seconds) => {
//   var time = date.toLocaleTimeString(navigator.language, {hour: '2-digit', minute:'2-digit'});
// }

//makes one new blank timer with an id of it's index in the timers array
const renderTimerComponent = (timer, index) =>
  `<div class="timer" data-index="${index}">
    <div class="timer-info">
      <h3 class="timer-label">${timer.label}</h3>
      <p class="timer-stats">Today's Total:${timer.todaysTime}s</p>
      <p class="timer-stats">Project Total: ${timer.totalTime}s</p>
    </div>
    <div class="timer-button button" data-id="${index}">${formatSeconds(timer.todaysTime)}</div>
  </div>`;

//initialize timers array with one timer object
let timers = [];
function newTimer() {
  return {
  label: "NEW PROJECT",
  totalTime: 0,
  todaysTime: 0,
  isRunning: false,
  intervalTicker: null
  }
};



//listener for square timer button. on click, if it was off, it turns on timer and adds
//1 to the totalTime and todaysTime every second. If it was on, it should stop the timer.
$('.timer-section').on('click', '.timer-button', function(event) {
  var start = new Date;
  let id = $(this).attr('data-id');
  let clickedTimer = timers[id];
  console.log(timers);
  if (!clickedTimer.isRunning) {
    clickedTimer.isRunning = true;
    clickedTimer.intervalTicker = setInterval(function(event) {
        clickedTimer.todaysTime += 1;
        clickedTimer.totalTime += 1;
        renderTimers(timers);
    }, 1000);
  } else {
    clickedTimer.isRunning = false;
    clearInterval(clickedTimer.intervalTicker);
  }
  console.log(`timer ${id}`)
})

//when "new timer" area is clicked, add a new object to timers array
//and re-render the whole array of timers.
$('.new-timer-button').on('click', function() {
  timers.push(newTimer());
  renderTimers(timers);
})

//render each object in timers array by passing values into a
// html block and then appending that to the dom.
function renderTimers(timers) {
  $('.timer-section').html('');
  for(let i=0; i < timers.length; i++) {
    let index = i;
    let timer = timers[i];
    $('.timer-section').append(renderTimerComponent(timer, index))
  }
}

//render existing timers on page load
renderTimers(timers);
