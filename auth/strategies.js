require('dotenv').config();
//const passport = require('passport');
const bcrypt = require('bcrypt');
const {BasicStrategy} = require('passport-http');
const {
    Strategy: JwtStrategy,
    ExtractJwt
} = require('passport-jwt');

const db = require('../models');
const JWT_SECRET = process.env.JWT_SECRET;
console.log("JWT_SECRET: "+ JWT_SECRET);

const basicStrategy = new BasicStrategy((username, password, callback) => {
    let user;
    db.Profile.findOne({where:{username: username}})
        .then(_user => {
            user = _user;
            if (!user) {
                // Return a rejected promise so we break out of the chain of .thens.
                // Any errors like this will be handled in the catch block.
                return Promise.reject({
                    reason: 'LoginError',
                    message: 'Incorrect username or password'
                });
            }
            return bcrypt.compare(password, user.password)
        })
        .then(isValid => {
            if (!isValid) {
                return Promise.reject({
                    reason: 'LoginError',
                    message: 'Incorrect username or password'
                });
            }
            return callback(null, user);
        })
        .catch(err => {
            if (err.reason === 'LoginError') {
                return callback(null, false, err);
            }
            return callback(err, false);
        });
});

basicStrategy._challenge = function () {
    return "";
};

const jwtStrategy = new JwtStrategy(
    {
        secretOrKey: JWT_SECRET,
        // Look for the JWT as a Bearer auth header
        jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('Bearer'),
        // Only allow HS256 tokens - the same as the ones we issue
        algorithms: ['HS256']
    },
    (payload, done) => {
        done(null, payload.user);
    }
);

module.exports = {basicStrategy, jwtStrategy};