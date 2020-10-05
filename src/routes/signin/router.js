const { Router: createRouter } = require('express');

const { newTokenRouter } = require('./new-token');

const { User, Session } = require('../../db');

const signinRouter = createRouter();

signinRouter.post('/', async (req, res) => {
  if (req.body.id === undefined) {
    res.json({
      error: {
        message: 'Parameter "id" is not specified'
      }
    });

    return;
  }

  if (req.body.password === undefined) {
    res.json({
      error: {
        message: 'Parameter "password" is not specified'
      }
    });

    return;
  }

  const user = await User.findOne({
    where: {
      login: req.body.id
    }
  });

  let isValidPassword = false;

  if (user !== null) {
    isValidPassword = await user.comparePassword(req.body.password);
  }

  if (!isValidPassword) {
    res.json({
      error: {
        message: 'User doesn\'t exist or password is incorrect'
      }
    });

    return;
  }

  const session = await Session.create({
    userId: user.id
  });

  res.json({
    response: {
      access_token: session.accessToken,
      access_token_expires_at: session.accessTokenExpiresAt,
      refresh_token: session.refreshToken,
      refresh_token_expires_at: session.refreshTokenExpiresAt
    }
  });
});

signinRouter.use('/new_token', newTokenRouter);

exports.signinRouter = signinRouter;
