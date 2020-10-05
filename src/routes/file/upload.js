const { Router: createRouter } = require('express');
const { pathExists: fileExists } = require('fs-extra');

const { File } = require('../../db');

const {
  uploadFile,
  checkAccess
} = require('../../middlewares');

const { LocalFile } = require('../../local-file');

const uploadRouter = createRouter();

uploadRouter.post('/', checkAccess, uploadFile, async (req, res) => {
  const localFile = new LocalFile(req.files.file);

  const file = await File.create({
    name: localFile.name,
    extension: localFile.extension,
    mimeType: localFile.mimeType,
    size: localFile.size,
    hash: localFile.hash
  });

  if (await fileExists(file.absolutePath)) {
    await localFile.remove();
  } else {
    await localFile.move(file.absolutePath);
  }

  res.json({
    response: {
      id: file.id
    }
  });
});

exports.uploadRouter = uploadRouter;
