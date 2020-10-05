const { Router: createRouter } = require('express');

const { checkAccess } = require('../middlewares');

const infoRouter = createRouter();

infoRouter.get('/', checkAccess, (req, res) => {
  const { user } = req.session;

  res.json({
    response: {
      id: user.id
    }
  });
});

exports.infoRouter = infoRouter;
