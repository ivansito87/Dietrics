const {router} = require('./auth-routes');
const {basicStrategy, jwtStrategy} = require('./strategies');

module.exports = {router, basicStrategy, jwtStrategy};