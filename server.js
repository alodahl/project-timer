const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const morgan = require('morgan');
const express = require('express');
const app = express();

const {DATABASE_URL, PORT} = require('./config');
const {Timer} = require('./models');

app.use(morgan('common'));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());
app.use(express.static('public'));

mongoose.Promise = global.Promise;

// app.listen(process.env.PORT || 8080);

module.exports = {app};


app.get('/timers', (req, res) => {
  Timer
    .find()
    .then(timers => {
      res.json(timers.map(timer => timer.apiRepr()));
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({error: 'something went wrong with the server!'});
    });
});

app.get('/timers/:id', (req, res) => {
  Timer
    .findById(req.params.id)
    .then(timer => res.json(timer.apiRepr()))
    .catch(err => {
      console.error(err);
      res.status(500).json({error: 'something went horribly awry'});
    });
});

////The required fields will be everything but "logs" & "totalTimeInSeconds"
app.post('/timers', (req, res) => {
  const requiredFields = ['label'];
  for (let i=0; i<requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`
      console.error(message);
      return res.status(400).send(message);
    }
  }

  Timer
    .create({
      label: req.body.label,
      category: req.body.category,
      creationDate: req.body.creationDate,
      projectNotes: req.body.projectNotes
    })
    .then(timer => res.status(201).json(timer.apiRepr()))
    .catch(err => {
        console.error(err);
        res.status(500).json({error: 'Something went wrong'});
    });

});

app.delete('/timers/:id', (req, res) => {
  Timer
    .findByIdAndRemove(req.params.id)
    .then(() => {
      res.status(204).json({message: 'success'});
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({error: 'something went terribly wrong'});
    });
});

 /////remember not to verify "logs" or "totalTimeInSeconds"
app.put('/timers/:id', (req, res) => {
  if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
    res.status(400).json({
      error: 'Request path id and request body id values must match'
    });
  }

  const updated = {};
  const updateableFields = ['label', 'category', 'creationDate', 'projectNotes'];
  updateableFields.forEach(field => {
    if (field in req.body) {
      updated[field] = req.body[field];
    }
  });

  Timer
    .findByIdAndUpdate(req.params.id, {$set: updated}, {new: true})
    .then(updatedTimer => res.status(204).end())
    .catch(err => res.status(500).json({message: 'Something went wrong'}));
});

app.put('/timers/:id/log', (req, res) => {
  if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
    res.status(400).json({
      error: 'Request path id and request body id values must match'
    });
  }

  const requiredFields = ['seconds', 'endDate'];

  for (let i=0; i<requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`
      console.error(message);
      return res.status(400).send(message);
    }
  }

   let newLogEntry = {
     seconds: req.body.seconds,
     endDate: req.body.endDate
   }

  Timer
    .findById(req.params.id)
    .then(timer => {
      timer.logs.push(newLogEntry);
      return timer.save()
    })
    .then(updatedTimer => res.status(204).end())
    .catch(err => res.status(500).json({message: 'Something went wrong'}));
});

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

// if server.js is called directly (aka, with `node server.js`), this block
// runs. but we also export the runServer command so other code (for instance, test code) can start the server as needed.
if (require.main === module) {
  runServer().catch(err => console.error(err));
};

module.exports = {runServer, app, closeServer};
