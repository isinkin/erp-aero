const {
  parse: pathParse
} = require('path');

const {
  move: moveFile,
  remove: removeFile
} = require('fs-extra');

const {
  extension: mimeExtension
} = require('mime-types');

const kParsedPath = Symbol('parsedPath');
const kName = Symbol('name');
const kExtension = Symbol('extension');
const kMimeType = Symbol('mimeType');
const kSize = Symbol('size');
const kHash = Symbol('hash');
const kPath = Symbol('path');

class LocalFile {
  constructor(payload) {
    this.payload = payload;

    this[kParsedPath] = pathParse(this.payload.name);
  }

  get name() {
    if (this[kName] === undefined) {
      this[kName] = this[kParsedPath].name;
    }

    return this[kName];
  }

  get extension() {
    if (this[kExtension] === undefined) {
      let extension = this[kParsedPath].ext.slice(1);

      if (extension.length === 0) {
        extension = mimeExtension(this[kParsedPath].ext);
      }

      this[kExtension] = extension;
    }

    return this[kExtension];
  }

  get mimeType() {
    if (this[kMimeType] === undefined) {
      this[kMimeType] = this.payload.mimetype;
    }

    return this[kMimeType];
  }

  get size() {
    if (this[kSize] === undefined) {
      this[kSize] = this.payload.size;
    }

    return this[kSize];
  }

  get hash() {
    if (this[kHash] === undefined) {
      this[kHash] = this.payload.md5;
    }

    return this[kHash];
  }

  get path() {
    if (this[kPath] === undefined) {
      this[kPath] = this.payload.tempFilePath;
    }

    return this[kPath];
  }

  move(newPath) {
    return moveFile(this.path, newPath);
  }

  remove() {
    return removeFile(this.path);
  }
}

exports.LocalFile = LocalFile;
