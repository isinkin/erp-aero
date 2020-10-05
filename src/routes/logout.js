const { Router: createRouter } = require('express');

const { checkAccess } = require('../middlewares');

const logoutRouter = createRouter();

logoutRouter.get('/', checkAccess, async (req, res) => {
  const { session } = req;

  await session.destroy();

  res.json({
    response: true
  });
});

exports.logoutRouter = logoutRouter;
