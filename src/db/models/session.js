const {
  Model,
  DataTypes
} = require('sequelize');

const { config } = require('../../config');

const { generateToken } = require('../helpers');

const sessionAttributes = {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },

  accessToken: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: () => (
      generateToken(config.security.accessToken.length)
    )
  },

  accessTokenExpiresAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: () => (
      new Date(Date.now() + config.security.accessToken.lifespan)
    )
  },

  refreshToken: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: () => (
      generateToken(config.security.refreshToken.length)
    )
  },

  refreshTokenExpiresAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: () => (
      new Date(Date.now() + config.security.refreshToken.lifespan)
    )
  }
};

class Session extends Model {
  get accessTokenExpired() {
    return this.accessTokenExpiresAt < Date.now();
  }

  get refreshTokenExpired() {
    return this.refreshTokenExpiresAt < Date.now();
  }
}

const defineSessionModel = (sequelize) => {
  Session.init(sessionAttributes, {
    sequelize,
    modelName: 'session'
  });
};

exports.defineSessionModel = defineSessionModel;

const defineSessionRelations = (sequelize) => {
  const { models } = sequelize;

  models.session.belongsTo(models.user, {
    onDelete: 'Cascade'
  });
};

exports.defineSessionRelations = defineSessionRelations;
