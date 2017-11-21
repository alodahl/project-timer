# Project Timer To-do

## Incomplete Tasks:

### AUTHENTICATION:
- figure out jwt_secret problem

### CLIENT-SIDE:
- add user alerts for signup errors (!== passwords, existing user, spacing issues)

### SERVER-SIDE:
- Travis tests don't pass (test db seems to be deleted when travis runs)
- Add test db collection after showing mentor
- delete endpoint send error object, not message(solution: remove "data" from dashboard.js CRUD console logs?)
- prevent user being posted if confirm password is not correct or in body

### DO LATER:
- do I need a user property in the timer -> later
- make sure to delete return all users at end of users/router.js; prod should not return users - dev purposes only

-----

## Completed Tasks:

### CLIENT-SIDE:
- Make landing page responsive for large widths
- use jquery to have timers display seconds, minutes, and hours.
- base timer rendering on index
- disconnect timers 2 thru 4
- Style the buttons to make them green when running (add-sub running class in button)
- connect index.js to landing page timer section.
- change images to lighter jpgs
- Today's time -> Mins instead of secs.
- create links between html files
- overflow solution for timer label text
- refactor js-affected classes: add or rename to js-<class>
- Modal for new timer
- Add delete timer / cancel creating checkbox.
- SVG -> JPEG / PNG / GIF / SVGZ
- Add "delete timer" button, remove checkbox
- Delete "add time" inputs from modal.
- "edit timer" button edits and deletes
- Make "start time" into dropdown calendar input
- Save everything, make a pull request, merge to master.
- make sure "edit timer" button works multiple times
- click on delete makes an AJAX Delete request, calls getTimersFromApi again.
- dashboard timers based on mongo id, not on index
- Prepopulate edit form. (dashboard)
- Prepopulate edit form. (landing-page)
- Populate form issues (dashboard & index)
- add timers/:id/log endpoint to dashboard.js
- add session totals to dashboard and index files
- fix CI test issue (test-...-api.js line 218 & 219)
- fix input text size in signup and login.html

### SERVER SIDE:
- check out a new branch. And start working on server.js.
- Maybe copy server.js from blogpost as starting point
- do models.js
- set up mlab timers and test databases, setup env vars on travis and heroku
- set up endpoints for POST, GET, PUT, and DELETE, and got desired results on Postman
- POST /api/timers/ -> creates a timer.
- GET /api/timers/
- PUT /api/timers/:id -> edit existing timer
- DELETE /api/timers/:id -> delete existing timer
- Use postman from now on.
- setup mongoose tests
- add mongoose tests for timers/:id/log

### AUTHENTICATION:
- Add authentication files using lesson example
- add endpoints to signup.html
- add endpoints to login.html
- test user authentication files in Postman
