const fileUpload = require('express-fileupload');

const { config } = require('../config');

const uploadFile = fileUpload({
  useTempFiles: true,
  tempFileDir: config.files.storagePath
});

exports.uploadFile = uploadFile;
