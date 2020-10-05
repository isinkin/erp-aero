const express = require('express');
const bodyParser = require('body-parser');

const { config } = require('./config');

const { router } = require('./routes');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  // eslint-disable-next-line no-console
  console.log(`[server] New request ${req.method} ${req.originalUrl}`);

  next();
});

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');

  next();
});

app.use(router);

app.listen(config.server.port, config.server.host, () => {
  // eslint-disable-next-line no-console
  console.log(`[server] Run on ${config.server.host}:${config.server.port}`);
});
