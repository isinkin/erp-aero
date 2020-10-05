const { promisify } = require('util');

const { remove: removeFile } = require('fs-extra');
const { Router: createRouter } = require('express');

const { File } = require('../../db');

const {
  uploadFile,
  checkAccess
} = require('../../middlewares');

const { LocalFile } = require('../../local-file');

const updateRouter = createRouter();

const asyncUploadFile = promisify(uploadFile);

updateRouter.put('/:id', checkAccess, async (req, res) => {
  if (req.params.id === undefined) {
    res.json({
      error: {
        message: 'Parameter "id" is not specified'
      }
    });

    return;
  }

  const id = Number.parseInt(req.params.id, 10);

  if (Number.isNaN(id)) {
    res.json({
      error: {
        message: 'Parameter "id" is not a number'
      }
    });

    return;
  }

  const file = await File.findByPk(id);

  if (file === null) {
    res.json({
      error: {
        message: `File by id "${id}" doesn't exist`
      }
    });

    return;
  }

  await asyncUploadFile(req, res);

  const localFile = new LocalFile(req.files.file);

  if (file.hash !== localFile.hash) {
    await removeFile(file.absolutePath);

    file.name = localFile.name;
    file.extension = localFile.extension;
    file.mimeType = localFile.mimeType;
    file.size = localFile.size;
    file.hash = localFile.hash;

    delete file.uploadedAt;
    delete file.relativePath;

    await file.save();

    await localFile.move(file.absolutePath);
  }

  res.json({
    response: true
  });
});

exports.updateRouter = updateRouter;
