const { remove: removeFile } = require('fs-extra');
const { Router: createRouter } = require('express');

const { File } = require('../../db');

const { checkAccess } = require('../../middlewares');

const deleteRouter = createRouter();

deleteRouter.delete('/', checkAccess, async (req, res) => {
  if (req.body.id === undefined) {
    res.json({
      error: {
        message: 'Parameter "id" is not specified'
      }
    });

    return;
  }

  const id = Number.parseInt(req.body.id, 10);

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

  await file.destroy();

  const similarFilesCount = await File.count({
    where: {
      hash: file.hash
    }
  });

  if (similarFilesCount === 0) {
    await removeFile(file.absolutePath);
  }

  res.json({
    response: true
  });
});

exports.deleteRouter = deleteRouter;
