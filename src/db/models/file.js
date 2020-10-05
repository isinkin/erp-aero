const { resolve: pathResolve } = require('path');

const {
  Model,
  DataTypes
} = require('sequelize');

const { config } = require('../../config');

const { defineDefaultValues } = require('../helpers');

const hashToLocalPath = (hash) => (
  `${hash.slice(0, 2)}/${hash.slice(2, 4)}/${hash.slice(4, 6)}`
);

const fileAttributes = {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },

  name: {
    type: DataTypes.STRING,
    allowNull: false
  },

  extension: {
    type: DataTypes.STRING,
    allowNull: false
  },

  mimeType: {
    type: DataTypes.STRING,
    allowNull: false
  },

  size: {
    type: DataTypes.INTEGER,
    allowNull: false
  },

  hash: {
    type: DataTypes.STRING,
    allowNull: false
  },

  uploadedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },

  relativePath: {
    type: DataTypes.STRING,
    allowNull: false
  }
};

class File extends Model {
  get absolutePath() {
    return pathResolve(config.files.storagePath, this.relativePath);
  }
}

const defineFileModel = (sequelize) => {
  File.init(fileAttributes, {
    sequelize,
    modelName: 'file'
  });

  defineDefaultValues(File, {
    relativePath(file) {
      return `${hashToLocalPath(file.hash)}/${file.hash}.${file.extension}`;
    }
  });
};

exports.defineFileModel = defineFileModel;

const defineFileRelations = () => {};

exports.defineFileRelations = defineFileRelations;
