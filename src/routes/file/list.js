const { Router: createRouter } = require('express');

const { File } = require('../../db');

const { checkAccess } = require('../../middlewares');

const listRouter = createRouter();

listRouter.get('/', checkAccess, async (req, res) => {
  let page = Number.parseInt(req.query.page, 10);

  if (Number.isNaN(page)) {
    page = 1;
  }

  let pageSize = Number.parseInt(req.query.list_size, 10);

  if (Number.isNaN(pageSize)) {
    pageSize = 10;
  }

  const offset = (page - 1) * pageSize;
  const limit = pageSize;

  const files = await File.findAll({ offset, limit });

  res.json({
    response: files.map((file) => ({
      name: file.name,
      extension: file.extension,
      mime_type: file.mimeType,
      size: file.size,
      uploaded_at: file.uploadedAt.getTime()
    }))
  });
});

exports.listRouter = listRouter;
