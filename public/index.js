"use strict";

let timers = [];
let newTimerForm = `<form class="edit-form" action="" method="">
  <h2 class="edit-form-header">customize your timer</h2>
  <p class="edit-form-description"><em>change one or more your project details at any time:</em></p>
  <div class="edit-form-item">
    <label for="project name">Project Name:</label>
    <input class="edit-form-input js-project-name" type="text" name="project name" value="" placeholder="PASTEL LANDSCAPE" maxlength="20">
  </div>
  <div class="edit-form-item">
    <label for="category">Category:</label>
    <input class="edit-form-input js-category-name" type="text" name="category" value="" placeholder="art" maxlength="20">
  </div>
  <div class="edit-form-item">
    <label for="start date">Start Date:</label>
    <input class="edit-form-input js-start-date" type="text" name="start date" value="" placeholder="optional" maxlength="18">
  </div>
  <div class="edit-form-item">
    <label for="notes">Notes:</label>
    <input class="edit-form-input edit-notes-input js-notes" type="text" name="notes" value="" placeholder="chalk pastels, 400lb cold-pressed paper" maxlength="50">
  </div>
  <div class="edit-form-item edit-time-section">
    <label class="edit-time-label" for="other time">Do you need to manually add time spent on your project?</label>
    <span class="edit-time-both-inputs" role:"add time manually">
      <input class="edit-form-input edit-time-input js-hours" type="text" name="other time" value="" placeholder="hours" maxlength="2">
      <input class="edit-form-input edit-time-input js-minutes" type="text" name="other time" value="" placeholder="minutes" maxlength="2">
    </span>
  </div>
  <div class="delete-timer-section">
    <input type="checkbox" class="delete-timer-checkbox" name="delete timer">
    <label for="delete timer">delete this timer forever</label>
  </div>
  <button class="form-button save-changes" type="button" role="submit" name="button">save changes</button>
  <button class="form-button cancel-button" type="button" name="button">cancel</button>
</form>`

//formats seconds into HOUR:MIN:SEC
const formatSeconds = (seconds) => {
  var date = new Date(null);
  date.setSeconds(seconds);
  return date.toISOString().substr(11, 8);
}

//formats seconds into 00h 00m
const formatHoursAndMinutes = (seconds, extraHours) => {
  var date = new Date(null);
  date.setSeconds(seconds);
  let hours = date.toISOString().substr(11, 2);
  let min = date.toISOString().substr(14, 2);
  let totalHours = Number(hours) + extraHours;
  if (extraHours) {
    return `${totalHours}h ${min}m`;
  } else {
    return `${hours}h ${min}m`;
  }
}

//makes one new blank timer with an id of it's index in the timers array
// <p class="timer-stats">Today's Total:${formatHoursAndMinutes(timer.todaysTime)}</p>

const renderTimerComponent = function (timer, index) {
  let part1ofTimer = `<div class="timer" data-index="${index}">
    <div class="timer-info">
      <h3 class="timer-label">${timer.label}</h3>
      <div class="other-timer-stats-div">
        <p class="timer-stats other-timer-stats">Category:${timer.category}</p>
        <p class="timer-stats other-timer-stats">Start Date:${timer.creationDate}</p>
        <p class="timer-stats other-timer-stats">Notes:${timer.projectNotes}</p>
      </div>
      <div class="timer-stats-div">
        <p class="timer-stats">Project Total: ${formatHoursAndMinutes(timer.totalTime, timer.hours24orMore)}</p>
      </div>
    </div>`;
  let part2ofStoppedTimer = `<div class="timer-button button" data-id="${index}" role="button" aria-label="Click to Start Timer">${formatSeconds(timer.todaysTime)}
  <img class="timer-icon" src="images/start-timer.svg"</div>
    </div>`;
  let part2ofRunningTimer = `<div class="timer-button button green-button" data-id="${index}" role="button" aria-label="Click to Stop Timer">${formatSeconds(timer.todaysTime)}
  <img class="timer-icon" src="images/stop-timer.svg"</div>
    </div>`;

  if (!timer.isRunning) {
    return (`${part1ofTimer}${part2ofStoppedTimer}`);
  } else {
    return (`${part1ofTimer}${part2ofRunningTimer}`);
  }
}

function todaysDate() {
var today = new Date();
var dd = today.getDate();
var mm = today.getMonth()+1; //January is 0!
var yyyy = today.getFullYear();

if(dd<10) {
    dd = '0'+dd
}
if(mm<10) {
    mm = '0'+mm
}
today = mm + '/' + dd + '/' + yyyy;
return(today);
}

//calling newTimer pushes a new timer object
//to the timers array
function newTimer(projectName, category, startDate, notes, hoursToAdd, minutesToAdd) {
  let newTimer = {
  label: projectName || "NEW PROJECT",
  category: category || "",
  creationDate: startDate || new Date(),
  projectNotes: notes || "",
  totalTime: 0,
  // totalTime: ((minutesToAdd*60)+(hoursToAdd*3600)) || (hoursToAdd*3600) || (minutesToAdd*60) || 0,
  // todaysTime: 0,
  // hours24orMore: 0,
  isRunning: false,
  intervalTicker: null
  }
  timers.push(newTimer);
};

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

function clearTimers() {
  projectName = "";
  category = "";
  startDate = "";
  notes = "";
  hoursToAdd = "";
  minutesToAdd = "";
}

//listener for square timer button. on click, if it was off, it turns on timer and adds
//1 to the totalTime and todaysTime every second. If it was on, it should stop the timer.
$('.js-timer-section').on('click', '.timer-button', function(event) {
  var start = new Date;
  let id = $(this).attr('data-id');
  let clickedTimer = timers[id];
  renderTimers(timers);
  console.log(this);
  if (!clickedTimer.isRunning) {
    clickedTimer.isRunning = true;
    clickedTimer.intervalTicker = setInterval(function(event) {
        // clickedTimer.todaysTime += 1;
        clickedTimer.totalTime += 1;
        // if (clickedTimer.totalTime === 86399) {
        //   clickedTimer.hours24orMore += 24;
        //   clickedTimer.totalTime = 0;
        // }
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
})

let projectName;
let category;
let startDate;
let notes;
let hoursToAdd;
let minutesToAdd;

//the next 6 listeners listen on input for project data changes
//on the new/edit-timer modal.  if data is entered,
//it becomes a global variable
$('.light').on('change', '.js-project-name', function(event) {
    projectName = event.currentTarget.value;
    console.log(projectName);
})

$('.light').on('change', '.js-category-name', function(event) {
    category = event.currentTarget.value;
    console.log(category);
})

$('.light').on('change', '.js-start-date', function(event) {
    startDate = event.currentTarget.value;
    console.log(startDate);
})

$('.light').on('change', '.js-notes', function(event) {
    notes = event.currentTarget.value;
    console.log(notes);
})

$('.light').on('change', '.js-hours', function(event) {
    hoursToAdd = event.currentTarget.value;
    console.log(hoursToAdd);
})

$('.light').on('change', '.js-minutes', function(event) {
    minutesToAdd = event.currentTarget.value;
    console.log(minutesToAdd);
})

//when the "save changes" button is pressed, make sure
//to only include truthy answers, then use them to
//generate a new timer object. last, clear the global
//variables for next time before closing modal.
$('.light').on('click', '.save-changes', function(event) {
  let a;
  let b;
  let c;
  let d;
  let e;
  let f;
  if (projectName) {a = projectName;};
  if (category) {b = category;};
  if (startDate) {c = startDate;};
  if (notes) {d = notes;};
  if (hoursToAdd) {e = hoursToAdd;};
  if (minutesToAdd) {f = minutesToAdd;};

  newTimer(a, b, c, d, e, f);
  renderTimers(timers);
  clearTimers();
  $('.js-modal').addClass("hidden");
  $('header').attr("aria-hidden", "false");
  $('main').attr("aria-hidden", "false");
  $('footer').attr("aria-hidden", "false");
})

//click cancel button to hide modal and show results page
$('.light').on('click', '.cancel-button', function(event) {
  $('.js-modal').addClass("hidden");
  $('header').attr("aria-hidden", "false");
  $('main').attr("aria-hidden", "false");
  $('footer').attr("aria-hidden", "false");
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
