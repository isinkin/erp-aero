const { Router: createRouter } = require('express');

const { File } = require('../../db');

const { checkAccess } = require('../../middlewares');

const downloadRouter = createRouter();

downloadRouter.get('/:id', checkAccess, async (req, res) => {
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

  res.sendFile(file.absolutePath);
});

exports.downloadRouter = downloadRouter;
