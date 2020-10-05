const { User, Session } = require('../db');

const { getTokenFromBearer } = require('../helpers');

const checkAccess = async (req, res, next) => {
  const accessToken = getTokenFromBearer(req.header('Authorization'));

  if (accessToken === undefined) {
    res.json({
      error: {
        message: 'Access token is not provided'
      }
    });

    return;
  }

  const session = await Session.findOne({
    where: {
      accessToken
    },
    include: [User]
  });

  const hasAccess = session !== null && !session.accessTokenExpired;

  if (!hasAccess) {
    if (session !== null) {
      await session.destroy();
    }

    res.json({
      error: {
        message: 'Session doesn\'t exist or access token has been expired'
      }
    });

    return;
  }

  req.session = session;

  next();
};

exports.checkAccess = checkAccess;
