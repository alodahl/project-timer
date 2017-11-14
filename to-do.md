# Project Timer To-do

## Incomplete Tasks:

### SERVER SIDE:
- setup mongoose tests


## Completed Tasks:

### CLIENT-SIDE
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
