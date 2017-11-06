const chai = require('chai');
const chaiHttp = require('chai-http');
// const mongoose = require('mongoose');

const should = chai.should();

const {app} = require('../server');

chai.use(chaiHttp);

describe('GET endpoint', function() {

        it('should return the public html file', function() {
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
});
