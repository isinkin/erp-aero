const { resolve: pathResolve } = require('path');

const config = {
  server: {
    host: 'localhost',
    port: 46234
  },

  database: {
    host: 'HOST',
    port: 10000,

    username: 'USERNAME',
    password: 'PASSWORD',

    database: 'DATABASE'
  },

  security: {
    accessToken: {
      length: 50,
      lifespan: (1000 * 60) * 10 // 10 minutes
    },

    refreshToken: {
      length: 50,
      lifespan: (1000 * 60 * 60) * 24 // 24 hours
    }
  },

  files: {
    storagePath: pathResolve(__dirname, '../storage/uploads/')
  }
};

exports.config = config;
