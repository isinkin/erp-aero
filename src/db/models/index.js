const file = require('./file');
const user = require('./user');
const session = require('./session');

module.exports = {
  ...file,
  ...user,
  ...session
};
