"use strict";

let state = {
  timers: [],
  idOfTimerBeingEdited: "",
  token:"",
  user: ""
}

const renderTimerComponent = function (timer) {
  return `
  <div class="timer" id="${timer.id}">
    <div class="timer-info">
      <h3 class="timer-label">${timer.label}</h3>
      <div class="other-timer-stats-div">
        <p class="timer-stats other-timer-stats">Category: ${timer.category}</p>
        <p class="timer-stats other-timer-stats">Start Date: ${dateToString(timer.creationDate).substr(0, 10)}</p>
        <p class="timer-stats other-timer-stats">Notes: ${timer.projectNotes}</p>
      </div>
      <div class="timer-stats-div">
        <p class="timer-stats">Project Total:  ${formatHoursAndMinutes(timer.totalTimeInSeconds)}</p>
        <p class="timer-stats">Session Total: ${formatHoursAndMinutes(timer.currentEntryCount)}</p>
      </div>
    </div>
    <button class="edit-icon-button js-edit-icon-button button" data-id="${timer.id}">
      <img class="edit-icon-img" src="images/edit.gif" alt="edit this timer">
    </button>
    <div class="timer-button button ${timer.isRunning? "green-button":"" }" data-id="${timer.id}" role="button" aria-label="Click to ${timer.isRunning? "Stop":"Start" } Timer">
      ${formatSeconds(timer.currentEntryCount)}
      <img class="timer-icon" src="${timer.isRunning? "images/stop-timer.png":"images/start-timer.png" } ">
    </div>
  </div>
  `;
}

const welcomeMessage = `
 <div class="welcome-get-started-message">
  <h2 class="cursive">Welcome to Project Timer!</h2>
  <p>Click the "new timer" button above to get started.</p>
 </div>
 `;


function getTimersFromApi() {
  const settings = {
    url: '/timers',
    headers: { 'Authorization': `Bearer ${state.token}` },
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
    headers: { 'Authorization': `Bearer ${state.token}` },
    data: timerData,
    dataType: 'json',
    type: state.idOfTimerBeingEdited? 'PUT' : 'POST',
    success: function(timer) {
      if(state.idOfTimerBeingEdited){
        for(var i = 0; i < state.timers.length; i++) {
          if(state.timers[i].id == state.idOfTimerBeingEdited) {
             state.timers[i].label = timer.label;
             state.timers[i].category = timer.category;
             state.timers[i].projectNotes = timer.projectNotes;
             break;
          }
        }
        renderTimers(state.timers)
      }else{
        state.timers.push(timer)
        renderTimers(state.timers)
      }
      closeModal();
      clearForm();
    },
    error: function(data) {
      console.log("Error: API could not answer your request.");
    }
  };
  $.ajax(settings);
}

function deleteTimerFromApi() {
  const settings = {
    url: `/timers/${state.idOfTimerBeingEdited}`,
    headers: { 'Authorization': `Bearer ${state.token}` },
    dataType: 'json',
    type: 'DELETE',
    success: function() {
      for(var i = 0; i < state.timers.length; i++) {
        if(state.timers[i].id == state.idOfTimerBeingEdited) {
            state.timers.splice(i, 1);
            break;
        }
      }
      renderTimers(state.timers)
      closeModal();
    },
    error: function(data) {
      console.log("Error: API could not answer your request.");
      alert("Error: " + data.responseJSON.message);
    }
  };
  $.ajax(settings);
}

function newLogEntry(newLog) {
  const settings = {
    id: newLog.timerId,
    url: `/timers/${newLog.timerId}/log`,
    headers: { 'Authorization': `Bearer ${state.token}` },
    data: newLog,
    dataType: 'json',
    type: 'PUT',
    success: function() {
      console.log(`${state.timers.find(timer => timer.id === this.id).currentEntryCount} seconds have been added to your log!`);
    },
    error: function(data) {
      console.log(`Error: API could not log your time for ${state.timers[newTimeEntry.id].label}.`);
    }
  };
  $.ajax(settings);
}

//render each object in timers array by passing values into a
// html block and then appending that to the dom.
// if there are no timers, add welcome message.
function renderTimers(timers) {
  $('.js-timer-section').html('');
  for(let index=0; index < timers.length; index++) {
    $('.js-timer-section').append(renderTimerComponent(timers[index]));
  }
  if (!state.timers.length) {
    $('.js-timer-section').html(welcomeMessage);
    console.log(state.user);
  }
}

// Finds timer with an id of state.idOfTimerBeingEdited,
// and changes the input values to current values on database
function populateForm() {
  let chosenTimer = state.timers.find(timer => timer.id === state.idOfTimerBeingEdited);
  let defaultDate = new Date().toISOString().substr(0, 10);
  if (state.idOfTimerBeingEdited){
   $('.js-project-name').val(`${chosenTimer.label}`);
   $('.js-category-name').val(`${chosenTimer.category}`);
   $('.js-start-date').val(`${(chosenTimer.creationDate).substr(0, 10)}`);
   $('.js-notes').val(`${chosenTimer.projectNotes}`);
 } else {
   $('.js-project-name').val('');
   $('.js-category-name').val('');
   $('.js-start-date').val(`${defaultDate}`);
   $('.js-notes').val('');
 }
}

function clearForm() {
  $('.js-project-name').val("");
  $('.js-category-name').val("");
  $('.js-start-date').val("");
  $('.js-notes').val("");
}

// Open a modal with user customization options,
// hiding main content.
function openModal(){
  populateForm();
  $('.js-modal').removeClass("hidden");
  $('header').attr("aria-hidden", "true");
  $('main').attr("aria-hidden", "true");
  $('footer').attr("aria-hidden", "true");
}

// Hide modal, clear form values, and show main content.
function closeModal(){
  $('.js-modal').addClass("hidden");
  $('header').attr("aria-hidden", "false");
  $('main').attr("aria-hidden", "false");
  $('footer').attr("aria-hidden", "false");
  $('.js-delete-alert').addClass('hidden');
  $('.js-delete-timer-section').removeClass('hidden');
  $('.submit-button').addClass('save-changes');
  $('.submit-button').removeClass('js-change-existing-timer');
  state.idOfTimerBeingEdited="";
}

//listener for square timer button. on click, if it was off, it turns on timer and adds
//1 to the totalTimeInSeconds and session every second. If it was on, it should stop counting
//and log the newest time count to the database.
$('.js-timer-section').on('click', '.timer-button', function(event) {
  var start = new Date;
  let id = $(this).attr('data-id');
  let clickedTimer = state.timers.find(timer => timer.id === id);
  state.idOfTimerBeingEdited = id;
  clickedTimer.isRunning = (!clickedTimer.isRunning);

  renderTimers(state.timers);
  if (clickedTimer.isRunning) {
    clickedTimer.currentEntryCount = 0;
    clickedTimer.intervalTicker = setInterval(function(event) {
      clickedTimer.totalTimeInSeconds += 1;
      clickedTimer.currentEntryCount += 1;
      renderTimers(state.timers);
    }, 1000);
  } else {
    clearInterval(clickedTimer.intervalTicker);
    let newTimeEntry = {
        timerId: `${id}`,
        seconds: `${clickedTimer.currentEntryCount}`,
        endDate: new Date()
    };
    newLogEntry(newTimeEntry);
  }
})

//on page load, save user authorization and name info,
//render the user's timers, and setup event listeners.
$(function(){

  state.token = localStorage.getItem("token");
  if(!state.token){
    window.location.href = '/login.html';
  }

  state.user = localStorage.getItem("user");
  if(!state.user){
    window.location.href = '/login.html';
  }

  $('.js-user-name').text(`Hi, ${state.user}!`);

  //render existing db timers on page load
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

  //click to create a new timer object
  $('.js-new-timer-button').on('click', function() {
    state.idOfTimerBeingEdited="";
    $('.js-delete-timer-section').addClass('hidden');
    openModal();
  })

  //when the "save changes" button is pressed,
  //send form values to database
  $('.edit-form').submit( function(event) {
    event.preventDefault()
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

  //clicking delete timer icon will open delete menu
  $('.light').on('click','.js-delete-timer-button', function() {
    event.preventDefault();
    $('.js-delete-alert').removeClass('hidden');
  })

  //clicking "yes, delete it" button will delete timer from db
  $('.light').on('click','.js-final-delete-it-button', function(event) {
    event.preventDefault();
    deleteTimerFromApi();
  })

  //clicking "no, cancel" will close delete menu
  $('.light').on('click','.js-cancel-delete-button', function() {
    event.preventDefault();
    $('.js-delete-alert').addClass('hidden');
  })

  //clicking edit button opens modal
  $('.js-timer-section').on('click','.js-edit-icon-button', function(event) {
     state.idOfTimerBeingEdited = $(this).attr('data-id');
     openModal();
  })

  //clicking log out icon will remove user authentication token
  //and load login page
  $('.js-log-out-button').on('click', function(event) {
    console.log("log out button clicked");
    state.token = "";
    window.location.href = "login.html";
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
