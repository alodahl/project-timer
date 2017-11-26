'use strict';
const chai = require('chai');
const chaiHttp = require('chai-http');
const jwt = require('jsonwebtoken');
const faker = require('faker');
const mongoose = require('mongoose');

const {app, runServer, closeServer} = require('../server');
const {User} = require('../users');
const {Timer} = require('../timers/models');
const {JWT_SECRET} = require('../config');
const {TEST_DATABASE_URL} = require('../config');

const expect = chai.expect;
const should = chai.should();

chai.use(chaiHttp);

function seedTimerData() {
  console.info('seeding Timer data');
  const seedData = [];

  for (let i=1; i<=10; i++) {
    seedData.push(generateTimerData());
  }
  // this will return a promise
  return Timer.insertMany(seedData);
}

// used to generate data to put in db
function generateTimerData() {
  return {
    label: faker.lorem.word(),
    category: faker.lorem.word(),
    creationDate: faker.date.recent(),
    projectNotes: faker.lorem.sentence(),
    logs: [{
      seconds: faker.random.number(),
      endDate: faker.date.recent()
    },
    {
      seconds: faker.random.number(),
      endDate: faker.date.recent()
    }]
  }
}

function tearDownDb() {
  console.warn('Deleting database');
  return mongoose.connection.dropDatabase();
}


describe('Protected Timer API resource', function() {
  const username = 'exampleUser';
  const password = 'examplePass';

  before(function() {
    return runServer(TEST_DATABASE_URL);
  });

  after(function() {
    return closeServer();
  });

  beforeEach(function() {
    return User.hashPassword(password).then(password =>
      User.create({
        username,
        password
      })
    );
  });

  beforeEach(function() {
    return seedTimerData();
  });

  afterEach(function() {
    return tearDownDb();
  });

  afterEach(function() {
    return User.remove({});
  });

  describe('GET endpoint', function() {

    it('Should reject requests with no credentials', function() {
      return chai
      .request(app)
      .get('/timers')
      .then(() =>
        expect.fail(null, null, 'Request should not succeed')
      )
      .catch(err => {
        if (err instanceof chai.AssertionError) {
          throw err;
        }

        const res = err.response;
        expect(res).to.have.status(401);
      });
    });

    it('Should reject requests with an invalid token', function() {
      const token = jwt.sign(
        {
          username
        },
        'wrongSecret',
        {
          algorithm: 'HS256',
          expiresIn: '7d'
        }
      );

      return chai
      .request(app)
      .get('/timers')
      .set('Authorization', `Bearer ${token}`)
      .then(() =>
      expect.fail(null, null, 'Request should not succeed')
    )
    .catch(err => {
      if (err instanceof chai.AssertionError) {
        throw err;
      }

      const res = err.response;
      expect(res).to.have.status(401);
    });
  });

  it('Should reject requests with an expired token', function() {
    const token = jwt.sign(
      {
        user: {
          username
        },
        exp: Math.floor(Date.now() / 1000) - 10 // Expired ten seconds ago
      },
      JWT_SECRET,
      {
        algorithm: 'HS256',
        subject: username
      }
    );

    return chai
    .request(app)
    .get('/timers')
    .set('authorization', `Bearer ${token}`)
    .then(() =>
    expect.fail(null, null, 'Request should not succeed')
  )
  .catch(err => {
    if (err instanceof chai.AssertionError) {
      throw err;
    }

    const res = err.response;
    expect(res).to.have.status(401);
  });
  });

  it('Should send protected data', function() {
    const token = jwt.sign(
      {
        user: {
          username
        }
      },
      JWT_SECRET,
      {
        algorithm: 'HS256',
        subject: username,
        expiresIn: '7d'
      }
    );

    return chai.request(app)
    .get('/timers')
    .set('authorization', `Bearer ${token}`)
    .then(res => {
      expect(res).to.have.status(200);
    });
  });

  it('should return all timer entries', function() {
    // strategy:
    //    1. get back all timer entries returned by by GET request to `/timers`
    //    2. prove res has right status, data type
    //    3. prove the number of entries we got back is equal to number
    //       in db.
    let res;
    const token = jwt.sign(
      {
        user: {
          username
        }
      },
      JWT_SECRET,
      {
        algorithm: 'HS256',
        subject: username,
        expiresIn: '7d'
      }
    );

    return chai.request(app)
    .get('/timers')
    .set('authorization', `Bearer ${token}`)
    .then(function(_res) {
      res = _res;
      res.should.have.status(200);
      res.body.should.have.length.of.at.least(1);
      return Timer.count();
    })
    .then(function(count) {
      res.body.should.have.lengthOf(count);
    });
  });

  it('should return entries with right fields', function() {
    // Strategy: Get back all entries, and ensure they have expected keys

    let resTimer;
    const token = jwt.sign(
      {
        user: {
          username
        }
      },
      JWT_SECRET,
      {
        algorithm: 'HS256',
        subject: username,
        expiresIn: '7d'
      }
    );

    return chai.request(app)
    .get('/timers')
    .set('authorization', `Bearer ${token}`)
    .then(function(res) {
      res.should.have.status(200);
      res.should.be.json;
      res.body.should.be.a('array');
      res.body.should.have.length.of.at.least(1);

      res.body.forEach(function(timer) {
        timer.should.be.a('object');
        timer.should.include.keys(
          'id', 'label', 'category', 'creationDate', 'projectNotes', 'totalTimeInSeconds');
        });
        resTimer = res.body[0];
        return Timer.findById(resTimer.id);
      })
      .then(function(Timer) {
        resTimer.id.should.equal(Timer.id);
        resTimer.label.should.equal(Timer.label);
        resTimer.category.should.equal(Timer.category);
        resTimer.projectNotes.should.equal(Timer.projectNotes);
        resTimer.totalTimeInSeconds.should.equal(Timer.totalTimeInSeconds);
      });
    });
  });
  describe('POST endpoint', function() {
    // strategy: make a POST request with data,
    // then prove that the timer object we get back has
    // right keys, and that `id` is there (which means
    // the data was inserted into db)
    it('should add a new timer', function() {

      let mostRecentTimer;
      const newTimer = generateTimerData();
      const token = jwt.sign(
        {
          user: {
            username
          }
        },
        JWT_SECRET,
        {
          algorithm: 'HS256',
          subject: username,
          expiresIn: '7d'
        }
      );

      return chai.request(app)
      .post('/timers')
      .set('authorization', `Bearer ${token}`)
      .send(newTimer)
      .then(function(res) {
        res.should.have.status(201);
        res.should.be.json;
        res.body.should.be.a('object');
        res.body.should.include.keys(
          'id', 'label', 'category', 'creationDate', 'projectNotes', 'totalTimeInSeconds');
          res.body.totalTimeInSeconds.should.equal(0);
          res.body.id.should.not.be.null;
          res.body.label.should.equal(newTimer.label);
          res.body.category.should.equal(newTimer.category);
          res.body.projectNotes.should.equal(newTimer.projectNotes);
          return Timer.findById(res.body.id);
        })
        .then(function(Timer) {
          Timer.label.should.equal(newTimer.label);
          Timer.category.should.equal(newTimer.category);
          Timer.projectNotes.should.equal(newTimer.projectNotes);
        });
      });
  });

  describe('PUT endpoints', function() {
    // strategy:
    //  1. Get an existing timer from db
    //  2. Make a PUT request to update that timer
    //  3. Prove timer returned by request contains data we sent
    //  4. Prove timer in db is correctly updated
    it('should update fields you send over', function() {
      const updateData = {
        label: 'fofofofofofofof',
        category: 'futuristic landscape'
      };

      const token = jwt.sign(
        {
          user: {
            username
          }
        },
        JWT_SECRET,
        {
          algorithm: 'HS256',
          subject: username,
          expiresIn: '7d'
        }
      );

      return Timer
      .findOne()
      .then(function(timer) {
        updateData.id = timer.id;

        // make request then inspect it to make sure it reflects
        // data we sent
        return chai.request(app)
        .put(`/timers/${timer.id}`)
        .set('authorization', `Bearer ${token}`)
        .send(updateData);
      })
      .then(function(res) {
        res.should.have.status(204);
        return Timer.findById(updateData.id);
      })
      .then(function(timer) {
        timer.label.should.equal(updateData.label);
        timer.category.should.equal(updateData.category);
      });
    });

    it('should update logs by appending new entry to array', function() {

      let timer;
      const newLogEntry = {
        seconds: 120,
        endDate: new Date()
      };
      const token = jwt.sign(
        {
          user: {
            username
          }
        },
        JWT_SECRET,
        {
          algorithm: 'HS256',
          subject: username,
          expiresIn: '7d'
        }
      );

      return Timer
      .findOne()
      .then(function(_timer) {
        timer = _timer;
        newLogEntry.id = timer.id;
        return chai.request(app)
        .put(`/timers/${timer.id}/log`)
        .set('authorization', `Bearer ${token}`)
        .send(newLogEntry);
      })
      .then(function(res) {
        res.should.have.status(204);
        return Timer.findById(timer.id);
      })
      .then(function(updatedTimer) {
        updatedTimer.logs[timer.logs.length - 1].seconds.should.equal(newLogEntry.seconds);
        updatedTimer.logs.reduce(function(totalTimeInSeconds, log){
          return totalTimeInSeconds + log.seconds;
        }, 0).should.equal(timer.totalTimeInSeconds);
      });
    });
  });

  describe('DELETE endpoint', function() {
    // strategy:
    //  1. get a timer document
    //  2. make a DELETE request for that timer's id
    //  3. assert that response has right status code
    //  4. prove that timer with the id doesn't exist in db anymore
    it('deletes a timer by id', function() {

      let timer;
      const token = jwt.sign(
        {
          user: {
            username
          }
        },
        JWT_SECRET,
        {
          algorithm: 'HS256',
          subject: username,
          expiresIn: '7d'
        }
      );

      return Timer
      .findOne()
      .then(function(_timer) {
        timer = _timer;
        return chai.request(app)
        .delete(`/timers/${timer.id}`)
        .set('authorization', `Bearer ${token}`)
      })
      .then(function(res) {
        res.should.have.status(204);
        return Timer.findById(timer.id);
      })
      .then(function(_timer) {
        should.not.exist(_timer);
      });
    });
  });
});
