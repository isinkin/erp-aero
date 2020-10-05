const { Sequelize } = require('sequelize');

const { config } = require('../config');

const {
  defineFileModel,
  defineUserModel,
  defineSessionModel,

  defineFileRelations,
  defineUserRelations,
  defineSessionRelations
} = require('./models');

const sequelize = new Sequelize({
  dialect: 'mysql',

  host: config.database.host,
  port: config.database.port,

  username: config.database.username,
  password: config.database.password,

  database: config.database.database
});

defineFileModel(sequelize);
defineUserModel(sequelize);
defineSessionModel(sequelize);

defineFileRelations(sequelize);
defineUserRelations(sequelize);
defineSessionRelations(sequelize);

sequelize.sync().then(() => {
  // eslint-disable-next-line no-console
  console.log('[database] Synced successfully');
});

const {
  file: File,
  user: User,
  session: Session
} = sequelize.models;

exports.sequelize = sequelize;

exports.File = File;
exports.User = User;
exports.Session = Session;
