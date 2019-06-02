
require('dotenv').config();
const express = require('express');
const passport = require('passport');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

//const config = require('../config');
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRY = process.env.JWT_EXPIRY;
const router = express.Router();


const createAuthToken = function(user) {
  return jwt.sign({user},JWT_SECRET, {
    subject: user.username,
    algorithm: 'HS256'
  });
};

const basicAuth = passport.authenticate('basic', {session: false});
router.use(bodyParser.json());

// The user provides a username and password to login
router.post('/login', basicAuth, (req, res) => {
  //const authToken = createAuthToken(req.user.serialize());
  //console.log('this is the req.user values:');
 //console.log(req.user);
  const authToken = createAuthToken(req.user);
  const usrRes = {
    user: req.user,
    authToken: authToken
  }
  res.json({usrRes});
});

const jwtAuth = passport.authenticate('jwt', {session: false});

// The user exchanges a valid JWT for a new one with a later expiration
router.post('/refresh', jwtAuth, (req, res) => {
  const authToken = createAuthToken(req.user);
  res.json({authToken});
});

router.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

module.exports = {router};
