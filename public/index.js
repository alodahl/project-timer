"use strict";

let timers = [];
let indexOfTimerBeingEdited;

//makes one timer with timer object values
//and an id which is its index in the timers array
const renderTimerComponent = function (timer, index) {
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
  <p class="timer-stats">Session Total: ${formatHoursAndMinutes(timer.currentEntryCount)}</p>
  </div>
  </div>
  <button class="edit-icon-button js-edit-icon-button button" data-id="${index}"><img class="edit-icon-img" src="images/edit.gif" alt="edit this timer"></button>
  `;
  let part2ofStoppedTimer = `<div class="timer-button button" data-id="${index}" role="button" aria-label="Click to Start Timer">${formatSeconds(timer.currentEntryCount)}
  <img class="timer-icon" src="images/start-timer.png"</div>
  </div>`;
  let part2ofRunningTimer = `<div class="timer-button button green-button" data-id="${index}" role="button" aria-label="Click to Stop Timer">${formatSeconds(timer.currentEntryCount)}
  <img class="timer-icon" src="images/stop-timer.png"</div>
  </div>`;

  if (!timer.isRunning) {
    return (`${part1ofTimer}${part2ofStoppedTimer}`);
  } else {
    return (`${part1ofTimer}${part2ofRunningTimer}`);
  }
}

//calling newTimer pushes a new timer object
//to the timers array
function newTimer(projectName, projectTotal, category, startDate, notes) {
  let newTimer = {
    label: projectName || "NEW PROJECT",
    category: category || "",
    creationDate: startDate || new Date(),
    projectNotes: notes || "",
    totalTimeInSeconds: projectTotal,
    currentEntryCount: 0,
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

function clearForm() {
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
      clickedTimer.currentEntryCount += 1;
      renderTimers(timers);
    }, 1000);
  } else {
    clearInterval(clickedTimer.intervalTicker);
  }
})

function openModal(){
  $('.js-modal').removeClass("hidden");
  $('header').attr("aria-hidden", "true");
  $('main').attr("aria-hidden", "true");
  $('footer').attr("aria-hidden", "true");
}

function populateForm() {
  // TODO: 1.Find timer with an index equal to indexOfTimerBeingEdited,
  //       2. Use that one as the timer being edited
  let chosenTimer = timers[indexOfTimerBeingEdited];
  console.log(`${chosenTimer.label}`);

   $('.js-project-name').val(`${chosenTimer.label}`);
   $('.js-category-name').val(`${chosenTimer.category}`);
   $('.js-start-date').val(`${chosenTimer.creationDate}`);
   $('.js-notes').val(`${chosenTimer.projectNotes}`);
}

function populateNewForm() {
  let defaultDate = new Date().toISOString().substr(0, 10);
  $('.js-project-name').val('NEW PROJECT');
  $('.js-category-name').val('');
  $('.js-start-date').val(`${defaultDate}`);
  $('.js-notes').val('');
}

function closeModal(){
  $('.js-modal').addClass("hidden");
  $('header').attr("aria-hidden", "false");
  $('main').attr("aria-hidden", "false");
  $('footer').attr("aria-hidden", "false");
  $('.js-delete-alert').addClass('hidden');
  indexOfTimerBeingEdited = "";
  $('.submit-button').addClass('save-new');
  $('.submit-button').removeClass('js-change-existing-timer');
  clearForm();
}

function verifyUserChanges(projectName, category, startDate, notes){
  if (projectName) {timers[indexOfTimerBeingEdited].label = projectName;};
  if (category) {timers[indexOfTimerBeingEdited].category = category;};
  if (startDate) {timers[indexOfTimerBeingEdited].creationDate = startDate;};
  if (notes) {timers[indexOfTimerBeingEdited].projectNotes =  notes;}
}

$(function(){
  //render existing timers on page load
  newTimer('WATERCOLOR PAINTING', 10000, 'Art', new Date(), '24" x 36"');
  newTimer('FINISH CODING SERVER', 2000, 'Web', new Date(), 'CI Tests');
  renderTimers(timers);

  //click cancel button to hide modal and show results page
  $('.light').on('click', '.cancel-button', function(event) {
    closeModal();
  })

  //click close button to hide modal and show results page
  $('.close-button').on('click', function(event) {
    closeModal();
  })

  //click outside of light modal to hide modal and return to results page
  $('.dark').on('click', function(event) {
    closeModal();
  })

  //click "new timer" area to open modal
  $('.js-new-timer-button').on('click', function() {;
    openModal();
    populateNewForm();
  })

  //click "save" button sends values to be rendered
  //as a new timer
  $('.light').on('click', '.save-new', function(event) {
    console.log("save-new button ran");
    let projectTime = 0;
    let projectName = $('.js-project-name').val();
    let category = $('.js-category-name').val();
    let startDate = $('.js-start-date').val();
    let notes = $('.js-notes').val();
    newTimer(projectName, projectTime, category, startDate, notes);
    renderTimers(timers);
    closeModal();
  })

  //click "new timer" area to open modal and populate with
  //existing timer values
  $('.js-timer-section').on('click','.js-edit-icon-button', function(event) {
    console.log("edit timer function began");
    let index = $(this).attr('data-id');
    $('.submit-button').removeClass('save-new');
    $('.submit-button').addClass('js-change-existing-timer');
    indexOfTimerBeingEdited = index;
    populateForm();
    openModal();
    console.log("whole edit timer function ran");
  })

  //click "save" to change existing timer values if added to form,
  //then re-render timers so they are current
  $('.light').on('click', '.js-change-existing-timer', function(event) {
    console.log("js-change-existing-timer button ran");
    let projectName = $('.js-project-name').val();
    let category = $('.js-category-name').val();
    let startDate = $('.js-start-date').val();
    let notes = $('.js-notes').val();

    verifyUserChanges(projectName, category, startDate, notes);
    renderTimers(timers);
    closeModal();
  })

  $('.light').on('click','.js-delete-timer-button', function() {
    event.preventDefault();
    $('.js-delete-alert').removeClass('hidden');
    console.log("delete timer button ran");
  })

  $('.light').on('click','.js-final-delete-it-button', function() {
    event.preventDefault();
    timers.splice([indexOfTimerBeingEdited], 1);
    renderTimers(timers);
    closeModal();
  })

  $('.light').on('click','.js-cancel-delete-button', function() {
    event.preventDefault();
    $('.js-delete-alert').addClass('hidden');
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
  let sec = date.toISOString().substr(17, 2);
  return `${hours}:${min}:${sec}`;
}

function dateToString(date){
  let dateString = "" + date;
  return dateString.substr(0, 15)
}
