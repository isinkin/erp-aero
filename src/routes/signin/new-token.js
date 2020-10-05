const { Router: createRouter } = require('express');

const {
  sequelize,

  User,
  Session
} = require('../../db');

const newTokenRouter = createRouter();

newTokenRouter.post('/', async (req, res) => {
  if (req.body.refresh_token === undefined) {
    res.json({
      error: {
        message: 'Parameter "refresh_token" is not specified'
      }
    });

    return;
  }

  const session = await Session.findOne({
    where: {
      refreshToken: req.body.refresh_token
    },
    include: [User]
  });

  const hasAccess = session !== null && !session.refreshTokenExpired;

  if (!hasAccess) {
    if (session !== null) {
      await session.destroy();
    }

    res.json({
      error: {
        message: 'Session doesn\'t exist or refresh token has been expired'
      }
    });

    return;
  }

  const transaction = await sequelize.transaction();

  let newSession;

  try {
    await session.destroy({ transaction });

    newSession = await Session.create(
      {
        userId: session.user.id
      },
      {
        transaction
      }
    );

    await transaction.commit();
  } catch (error) {
    await transaction.rollback();

    res.json({
      error: {
        message: 'An unknown error has occurred'
      }
    });

    return;
  }

  res.json({
    response: {
      access_token: newSession.accessToken,
      access_token_expires_at: newSession.accessTokenExpiresAt,
      refresh_token: newSession.refreshToken,
      refresh_token_expires_at: newSession.refreshTokenExpiresAt
    }
  });
});

exports.newTokenRouter = newTokenRouter;
