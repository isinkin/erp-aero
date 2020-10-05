const {
  hash: bcryptHash,
  genSalt: bcryptGenSalt,
  compare: bcryptCompare
} = require('bcrypt');

const {
  Model,
  DataTypes
} = require('sequelize');

const userAttributes = {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },

  login: {
    type: DataTypes.STRING,
    allowNull: false
  },

  password: {
    type: DataTypes.STRING,
    allowNull: false
  },

  lastChangePasswordAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
};

class User extends Model {
  comparePassword(password) {
    return bcryptCompare(password, this.password);
  }
}

const generatePasswordHash = async (user) => {
  if (!user.changed('password')) {
    return;
  }

  const salt = await bcryptGenSalt();
  const hash = await bcryptHash(user.password, salt);

  user.password = hash;

  delete user.lastChangePasswordAt;
};

const defineUserModel = (sequelize) => {
  User.init(userAttributes, {
    sequelize,
    modelName: 'user'
  });

  User.beforeCreate(generatePasswordHash);
  User.beforeUpdate(generatePasswordHash);
};

exports.defineUserModel = defineUserModel;

const defineUserRelations = () => {};

exports.defineUserRelations = defineUserRelations;
