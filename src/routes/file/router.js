const { Router: createRouter } = require('express');

const { File } = require('../../db');

const { checkAccess } = require('../../middlewares');

const { listRouter } = require('./list');
const { deleteRouter } = require('./delete');
const { updateRouter } = require('./update');
const { uploadRouter } = require('./upload');
const { downloadRouter } = require('./download');

const fileRouter = createRouter();

fileRouter.get('/:id([0-9]+)', checkAccess, async (req, res) => {
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

  res.json({
    response: {
      name: file.name,
      extension: file.extension,
      mime_type: file.mimeType,
      size: file.size,
      uploaded_at: file.uploadedAt.getTime()
    }
  });
});

fileRouter.use('/list', listRouter);
fileRouter.use('/delete', deleteRouter);
fileRouter.use('/update', updateRouter);
fileRouter.use('/upload', uploadRouter);
fileRouter.use('/download', downloadRouter);

exports.fileRouter = fileRouter;
