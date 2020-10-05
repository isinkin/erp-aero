const uploadFile = require('./upload-file');
const checkAccess = require('./check-access');

module.exports = {
  ...uploadFile,
  ...checkAccess
};
