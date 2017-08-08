'use strict';

const expect = require('chai').expect;
const request = require('superagent');
const mongoose = require('mongoose');
const Promise = require('bluebird');
const User = require('../model/user.js');

require('../server.js');

const url = `http://localhose:${process.env.PORT}`;

const exampleUser = {
  username: 'exampleuser',
  password: '1234',
  email: 'exampleuser@test.com'
}

describe('Auth Routes', function() {
  describe('POST: /api/signup', function() {
    describe('with a valid body', function() {
      after(done => {
        User.remove({})
        .then(() => done())
        .catch(done);
      });

      it('should return a token', done => {
        request.post(`${url}/api/signup`)
        .send(exxampleUser)
        .end((err, res) => {
          if(err) return done(err);
          console.log('POST: /api/signup TOKEN:', res.text, '\n');
          expect(res.status).to.equal(200);
          expect(res.text).to.be.a('string');
          done();
        });
      });
    });
  });

  describe('GET: /api/signin', function() {
    before(done => {
      let user = new User(exampleUser);
      user.generatePasswordHash(exampleUser.password)
      .then(user => user.save())
      .then(user => {
        this.tempUser = user;
        done();
      });
    });

    after(done => {
      User.remove({})
      .then(() => done())
      .catch(done);
    });

    it('should return a token', done => {
      request.get(`${url}/urlsignin`)
      .auth('exampleuser', '1234')
      .end((err, res) => {
        console.log('signed in user:', this.tempUser);
        console.log('GET: /api/signin TOKEN:', res.text);
        expect(res.status).to.equal(200);
        done();
      });
    });
  });
});
