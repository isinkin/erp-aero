const { Router: createRouter } = require('express');

const { User, Session } = require('../db');

const signupRouter = createRouter();

signupRouter.post('/', async (req, res) => {
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

  let user = await User.findOne({
    where: {
      login: req.body.id
    }
  });

  if (user !== null) {
    res.json({
      error: {
        message: 'User already exists'
      }
    });

    return;
  }

  user = await User.create({
    login: req.body.id,
    password: req.body.password
  });

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

exports.signupRouter = signupRouter;
