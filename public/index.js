"use strict";

let timers = [];

//makes one new blank timer with an id of it's index in the timers array
const renderTimerComponent = function (timer, index) {
  //<p class="timer-stats">Today's Total:${formatHoursAndMinutes(timer.todaysTime)}</p>
  let part1ofTimer = `<div class="timer" data-index="${index}">
  <div class="timer-info">
  <h3 class="timer-label">${timer.label}</h3>
  <div class="other-timer-stats-div">
  <p class="timer-stats other-timer-stats">Category: ${timer.category}</p>
  <p class="timer-stats other-timer-stats">Start Date: ${dateToString(timer.creationDate)}</p>
  <p class="timer-stats other-timer-stats">Notes: ${timer.projectNotes}</p>
  </div>
  <div class="timer-stats-div">

  <p class="timer-stats">Project Total: ${formatHoursAndMinutes(timer.totalTimeInSeconds)}</p>
  </div>
  </div>`;
  let part2ofStoppedTimer = `<div class="timer-button button" data-id="${index}" role="button" aria-label="Click to Start Timer">${formatSeconds(timer.totalTimeInSeconds)}
  <img class="timer-icon" src="images/start-timer.svg"</div>
  </div>`;
  let part2ofRunningTimer = `<div class="timer-button button green-button" data-id="${index}" role="button" aria-label="Click to Stop Timer">${formatSeconds(timer.totalTimeInSeconds)}
  <img class="timer-icon" src="images/stop-timer.svg"</div>
  </div>`;

  if (!timer.isRunning) {
    return (`${part1ofTimer}${part2ofStoppedTimer}`);
  } else {
    return (`${part1ofTimer}${part2ofRunningTimer}`);
  }
}

//calling newTimer pushes a new timer object
//to the timers array
function newTimer(projectName, category, startDate, notes) {
  let newTimer = {
    label: projectName || "NEW PROJECT",
    category: category || "",
    creationDate: startDate || new Date(),
    projectNotes: notes || "",
    totalTimeInSeconds: 0,
    isRunning: false,
    intervalTicker: null
  }
  timers.push(newTimer);
};

//render each object in timers array by passing values into a
// html block and then appending that to the dom.
function renderTimers(timers) {
  $('.js-timer-section').html('');
  for(let index=0; index < timers.length; index++) {
    $('.js-timer-section').append(renderTimerComponent(timers[index], index));
  }
}

function clearTimers() {
  $('.js-project-name').val("");
  $('.js-category-name').val("");
  $('.js-start-date').val("");
  $('.js-notes').val("");
}

//listener for square timer button. on click, if it was off, it turns on timer and adds
//1 to the totalTimeInSeconds and todaysTime every second. If it was on, it should stop the timer.
$('.js-timer-section').on('click', '.timer-button', function(event) {
  var start = new Date;
  let id = $(this).attr('data-id');
  let clickedTimer = timers[id];
  clickedTimer.isRunning = (!clickedTimer.isRunning);
  renderTimers(timers);
  if (clickedTimer.isRunning) {
    clickedTimer.intervalTicker = setInterval(function(event) {
      clickedTimer.totalTimeInSeconds += 1;
      renderTimers(timers);
    }, 1000);
  } else {
    clearInterval(clickedTimer.intervalTicker);
  }
})

function closeModal(){
  $('.js-modal').addClass("hidden");
  $('header').attr("aria-hidden", "false");
  $('main').attr("aria-hidden", "false");
  $('footer').attr("aria-hidden", "false");
}

$(function(){
  //render existing timers on page load
  newTimer("WATERCOLOR PAINTING");
  newTimer("FINISH CODING SERVER");
  renderTimers(timers);

  //click cancel button to hide modal and show results page
  $('.light').on('click', '.cancel-button', function(event) {
    closeModal();
  })

  //click close button to hide modal and show results page
  $('.close-button').on('click', function(event) {
    closeModal()
  })

  //click outside of light modal to hide modal and return to results page
  $('.dark').on('click', function(event) {
    closeModal()
  })
  
  //when "new timer" area is clicked, add a new object to timers array
  //with newTimer function and re-render the whole array of timers.
  // Then open a modal with user customization options,
  // hiding main content.
  $('.js-new-timer-button').on('click', function() {
    $('.js-modal').removeClass("hidden");
    $('header').attr("aria-hidden", "true");
    $('main').attr("aria-hidden", "true");
    $('footer').attr("aria-hidden", "true");
  })

  //when the "save changes" button is pressed, make sure
  //to only include truthy answers, then use them to
  //generate a new timer object. last, clear the global
  //variables for next time before closing modal.
  $('.light').on('click', '.save-changes', function(event) {
    let projectName = $('.js-project-name').val();
    let category = $('.js-category-name').val();
    let startDate = $('.js-start-date').val();
    let notes = $('.js-notes').val();
    newTimer(projectName, category, startDate, notes);
    renderTimers(timers);
    clearTimers();
    closeModal()
  })
})

//////////// TIME TO STRING   ////////////
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

function dateToString(date){
  let dateString = "" + date;
  return dateString.substr(0, 15)
}
