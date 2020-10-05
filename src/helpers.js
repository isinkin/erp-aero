const bearerRe = /^Bearer\s*(.+)/;

const getTokenFromBearer = (authorization) => {
  if (authorization === undefined) {
    return undefined;
  }

  const match = authorization.match(bearerRe);

  if (match === null) {
    return undefined;
  }

  return match[1];
};

exports.getTokenFromBearer = getTokenFromBearer;
