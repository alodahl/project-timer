"use strict";

let state = {
  timers: [],
  idOfTimerBeingEdited: ""
}

const renderTimerComponent = function (timer, id) {
  console.log(id);
  //<p class="timer-stats">Today's Total:${formatHoursAndMinutes(timer.todaysTime)}</p>
  let part1ofTimer = `<div class="timer" data-id="${id}">
  <div class="timer-info">
  <h3 class="timer-label">${timer.label}</h3>
  <div class="other-timer-stats-div">
  <p class="timer-stats other-timer-stats">Category: ${timer.category}</p>
  <p class="timer-stats other-timer-stats">Start Date: ${dateToString(timer.creationDate).substr(0, 10)}</p>
  <p class="timer-stats other-timer-stats">Notes: ${timer.projectNotes}</p>
  </div>
  <div class="timer-stats-div">
  <p class="timer-stats">Project Total: ${formatHoursAndMinutes(timer.totalTimeInSeconds)}</p>
  <p></p>
  </div>
  </div>
  <button class="edit-icon-button js-edit-icon-button button" data-id="${id}"><img class="edit-icon-img" src="images/edit.gif" alt="edit this timer"></button>
  `;
  let part2ofStoppedTimer = `<div class="timer-button button" data-id="${id}" role="button" aria-label="Click to Start Timer">${formatSeconds(timer.totalTimeInSeconds)}
  <img class="timer-icon" src="images/start-timer.png"</div>
  </div>`;
  let part2ofRunningTimer = `<div class="timer-button button green-button" data-id="${timer.id}" role="button" aria-label="Click to Stop Timer">${formatSeconds(timer.totalTimeInSeconds)}
  <img class="timer-icon" src="images/stop-timer.png"</div>
  </div>`;

  if (!timer.isRunning) {
    return (`${part1ofTimer}${part2ofStoppedTimer}`);
  } else {
    return (`${part1ofTimer}${part2ofRunningTimer}`);
  }
}

function getTimersFromApi() {
  const settings = {
    url: '/timers',
    // data: {
    //   data
    // },
    dataType: 'json',
    type: 'GET',
    success: function(timers) {
      state.timers=timers;
      renderTimers(state.timers);
    },
    error: function(data) {
      console.log("Error: API could not answer your request.");
    }
  };
  $.ajax(settings);
}

function saveTimerToApi(timerData) {
  const settings = {
    url: `/timers/${state.idOfTimerBeingEdited}`,
    data: timerData,
    dataType: 'json',
    type: state.idOfTimerBeingEdited? 'PUT' : 'POST',
    success: function(timer) {
      getTimersFromApi()
      clearForm();
      closeModal();
    },
    error: function(data) {
      console.log("Error: API could not answer your request.", data);
    }
  };
  $.ajax(settings);
}

function deleteTimerFromApi() {
  const settings = {
    url: `/timers/${state.idOfTimerBeingEdited}`,
    dataType: 'json',
    type: 'DELETE',
    success: function() {
      getTimersFromApi()
      closeModal();
      // state.timers.splice([indexOfTimerBeingEdited], 1);
      //      renderTimers(state.timers);
    },
    error: function(data) {
      console.log("Error: API could not answer your request.", data);
    }
  };
  $.ajax(settings);
}


//render each object in timers array by passing values into a
// html block and then appending that to the dom.
function renderTimers(timers) {
  $('.js-timer-section').html('');
  for(let index=0; index < timers.length; index++) {
    $('.js-timer-section').append(renderTimerComponent(timers[index], timers[index].id));
  }
}

function populateForm() {
  // TODO: 1.Find timer with an id of state.idOfTimerBeingEdited,
  //       2. Use that one as the timer being edited
  let chosenTimer = state.timers.find(timer => timer.id === state.idOfTimerBeingEdited )

  console.log(chosenTimer);
   $('.js-project-name').attr('value', `${chosenTimer.label}`);
   $('.js-category-name').attr('value', `${chosenTimer.category}`);
   $('.js-start-date').attr('value', `${chosenTimer.creationDate}`);
   $('.js-notes').attr('value', `${chosenTimer.projectNotes}`);
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
  let clickedTimer = state.timers.find(timer => timer.id === id);
  clickedTimer.isRunning = (!clickedTimer.isRunning);
  renderTimers(state.timers);
  if (clickedTimer.isRunning) {
    clickedTimer.intervalTicker = setInterval(function(event) {
      clickedTimer.totalTimeInSeconds += 1;
      renderTimers(state.timers);
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
  $('.js-delete-alert').addClass('hidden');
  $('.submit-button').addClass('save-changes');
  $('.submit-button').removeClass('js-change-existing-timer');
  state.idOfTimerBeingEdited="";
  // $('.js-project-name').prop('required', 'false');
}

function openModal(){
  populateForm();
  $('.js-modal').removeClass("hidden");
  $('header').attr("aria-hidden", "true");
  $('main').attr("aria-hidden", "true");
  $('footer').attr("aria-hidden", "true");
}

// function verifyUserChanges(label, category, creationDate, notes){
//   if (label) {state.timers[indexOfTimerBeingEdited].label = label;};
//   if (category) {state.timers[indexOfTimerBeingEdited].category = category;};
//   if (creationDate) {state.timers[indexOfTimerBeingEdited].creationDate = creationDate;};
//   if (notes) {state.timers[indexOfTimerBeingEdited].projectNotes =  notes;}
// }

$(function(){
  //render existing timers on page load
  getTimersFromApi();

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
    // $('.js-project-name').prop('required', 'true');
    openModal();
  })

  //when the "save changes" button is pressed, make sure
  //to only include truthy answers, then use them to
  //generate a new timer object. last, clear the global
  //variables for next time before closing modal.
  $('.edit-form').submit( function(event) {
    event.preventDefault()
    console.log("save button clicked");
    let timerData = {
      label: $('.js-project-name').val(),
      category: $('.js-category-name').val(),
      creationDate: $('.js-start-date').val(),
      projectNotes: $('.js-notes').val(),
    }
    if(state.idOfTimerBeingEdited){
      timerData.id = state.idOfTimerBeingEdited;
    }
    saveTimerToApi(timerData);
  })

  $('.light').on('click', '.js-change-existing-timer', function(event) {
    console.log("js-change-existing-timer button ran");
    let label = $('.js-project-name').val();
    let category = $('.js-category-name').val();
    let creationDate = $('.js-start-date').val();
    let projectNotes = $('.js-notes').val();

    verifyUserChanges(label, category, creationDate, projectNotes);
    renderTimers(state.timers);
    clearForm();
    closeModal();
  })

  $('.light').on('click','.js-delete-timer-button', function() {
    event.preventDefault();
    $('.js-delete-alert').removeClass('hidden');
  })

  $('.light').on('click','.js-final-delete-it-button', function() {
    event.preventDefault();
    deleteTimerFromApi();
    // TODO: ajax request to delete, on success.
    //      state.timers.splice([indexOfTimerBeingEdited], 1);
    //      renderTimers(state.timers);
    //      closeModal();
  })

  $('.light').on('click','.js-cancel-delete-button', function() {
    event.preventDefault();
    $('.js-delete-alert').addClass('hidden');
  })

  $('.js-timer-section').on('click','.js-edit-icon-button', function(event) {
     let id = $(this).attr('data-id');
     state.idOfTimerBeingEdited = id;
     console.log(state.idOfTimerBeingEdited);
     openModal();
     console.log("whole edit timer function ran");
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
