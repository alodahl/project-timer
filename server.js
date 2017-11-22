const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const morgan = require('morgan');
const express = require('express');
const passport = require('passport');
const app = express();

const {DATABASE_URL, PORT} = require('./config');
const {router: usersRouter} = require('./users');
const {router: timersRouter} = require('./timers');
const {router: authRouter, localStrategy, jwtStrategy} = require('./auth');

mongoose.Promise = global.Promise;

app.use(morgan('common'));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());
app.use(express.static('public'));

app.use(passport.initialize());
passport.use('local', localStrategy);
passport.use(jwtStrategy);

app.use('/users', usersRouter);
app.use('/auth', authRouter);
app.use('/timers', timersRouter)

app.use('*', function(req, res) {
  res.status(404).json({message: 'Not Found'});
});

let server;

function runServer(databaseUrl=DATABASE_URL, port=PORT) {
  return new Promise((resolve, reject) => {
    mongoose.connect(databaseUrl, {useMongoClient: true}, err => {
      if (err) {
        return reject(err);
      }
      server = app.listen(port, () => {
        console.log(`Your app is listening on port ${port}`);
        resolve();
      })
      .on('error', err => {
        mongoose.disconnect();
        reject(err);
      });
    });
  });
}

function closeServer() {
  return mongoose.disconnect().then(() => {
     return new Promise((resolve, reject) => {
       console.log('Closing server');
       server.close(err => {
           if (err) {
               return reject(err);
           }
           resolve();
       });
     });
  });
}

if (require.main === module) {
  runServer().catch(err => console.error(err));
};

module.exports = {runServer, app, closeServer};
