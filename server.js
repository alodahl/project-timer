const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const morgan = require('morgan');
const express = require('express');
const app = express();

// const {DATABASE_URL, PORT} = require('./config');
const {Timer} = require('./models');

app.use(morgan('common'));
app.use(bodyParser.json());
app.use(express.static('public'));

mongoose.Promise = global.Promise;

app.listen(process.env.PORT || 8080);

module.exports = {app};


app.get('/timers', (req, res) => {
  Timer
    .find()
    .then(timers => {
      res.json(posts.map(post => post.apiRepr()));
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({error: 'something went terribly wrong'});
    });
});
//
// app.get('/timers/:id', (req, res) => {
//   Timers
//     .findById(req.params.id)
//     .then(post => res.json(post.apiRepr()))
//     .catch(err => {
//       console.error(err);
//       res.status(500).json({error: 'something went horribly awry'});
//     });
// });
// /////The required fields will be everything but "logs" & "totalTimeInSeconds"
// app.post('/timers', (req, res) => {
//   const requiredFields = ['title', 'content', 'author'];
//   for (let i=0; i<requiredFields.length; i++) {
//     const field = requiredFields[i];
//     if (!(field in req.body)) {
//       const message = `Missing \`${field}\` in request body`
//       console.error(message);
//       return res.status(400).send(message);
//     }
//   }
//
//   Timers
//     .create({
//       title: req.body.title,
//       content: req.body.content,
//       author: req.body.author
//     })
//     .then(blogPost => res.status(201).json(blogPost.apiRepr()))
//     .catch(err => {
//         console.error(err);
//         res.status(500).json({error: 'Something went wrong'});
//     });
//
// });
//
//
// app.delete('/timers/:id', (req, res) => {
//   Timer
//     .findByIdAndRemove(req.params.id)
//     .then(() => {
//       res.status(204).json({message: 'success'});
//     })
//     .catch(err => {
//       console.error(err);
//       res.status(500).json({error: 'something went terribly wrong'});
//     });
// });
//
//  /////remember not to test "logs" or "totalTimeInSeconds"
// app.put('/timers/:id', (req, res) => {
//   if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
//     res.status(400).json({
//       error: 'Request path id and request body id values must match'
//     });
//   }
//
//   const updated = {};
//   const updateableFields = ['title', 'content', 'author'];
//   updateableFields.forEach(field => {
//     if (field in req.body) {
//       updated[field] = req.body[field];
//     }
//   });
//
//   BlogPost
//     .findByIdAndUpdate(req.params.id, {$set: updated}, {new: true})
//     .then(updatedPost => res.status(204).end())
//     .catch(err => res.status(500).json({message: 'Something went wrong'}));
// });
//
// app.use('*', function(req, res) {
//   res.status(404).json({message: 'Not Found'});
// });
//
// // closeServer needs access to a server object, but that only
// // gets created when `runServer` runs, so we declare `server` here
// // and then assign a value to it in run
// let server;
//
// // this function connects to our database, then starts the server
// function runServer(databaseUrl=DATABASE_URL, port=PORT) {
//   return new Promise((resolve, reject) => {
//     mongoose.connect(databaseUrl, {useMongoClient: true}, err => {
//       if (err) {
//         return reject(err);
//       }
//       server = app.listen(port, () => {
//         console.log(`Your app is listening on port ${port}`);
//         resolve();
//       })
//       .on('error', err => {
//         mongoose.disconnect();
//         reject(err);
//       });
//     });
//   });
// }
//
// // this function closes the server, and returns a promise. we'll
// // use it in our integration tests later.
// function closeServer() {
//   return mongoose.disconnect().then(() => {
//      return new Promise((resolve, reject) => {
//        console.log('Closing server');
//        server.close(err => {
//            if (err) {
//                return reject(err);
//            }
//            resolve();
//        });
//      });
//   });
// }
//
// // if server.js is called directly (aka, with `node server.js`), this block
// // runs. but we also export the runServer command so other code (for instance, test code) can start the server as needed.
// if (require.main === module) {
//   runServer().catch(err => console.error(err));
// };
//
// module.exports = {runServer, app, closeServer};
