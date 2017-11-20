const chai = require('chai');
const chaiHttp = require('chai-http');
// const mongoose = require('mongoose');

const should = chai.should();

const {app} = require('../server');

chai.use(chaiHttp);

describe('GET endpoints', function() {

  it('should return the public index.html file', function() {
    //strategy:  test that get request responds with a string
    //from public/index.html
    let res;
    return chai.request(app)
    .get('/')
    .then(function(_res) {
      res = _res;
      res.should.have.status(200);
      res.should.be.html;
    });
  });

  it('should return the public login.html file', function() {
    //strategy:  test that get request responds with a string
    //from public/index.html
    let res;
    return chai.request(app)
    .get('/login.html')
    .then(function(_res) {
      res = _res;
      res.should.have.status(200);
      res.should.be.html;
    });
  });

  it('should return the public signup.html file', function() {
    //strategy:  test that get request responds with a string
    //from public/index.html
    let res;
    return chai.request(app)
    .get('/signup.html')
    .then(function(_res) {
      res = _res;
      res.should.have.status(200);
      res.should.be.html;
    });
  });

  it('should return the public dashboard.html file', function() {
    //strategy:  test that get request responds with a string
    //from public/index.html
    let res;
    return chai.request(app)
    .get('/dashboard.html')
    .then(function(_res) {
      res = _res;
      res.should.have.status(200);
      res.should.be.html;
    });
  });
});
