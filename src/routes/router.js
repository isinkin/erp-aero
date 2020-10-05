const { Router: createRouter } = require('express');

const { infoRouter } = require('./info');
const { fileRouter } = require('./file');
const { signupRouter } = require('./signup');
const { signinRouter } = require('./signin');
const { logoutRouter } = require('./logout');

const router = createRouter();

router.use('/info', infoRouter);
router.use('/file', fileRouter);
router.use('/signup', signupRouter);
router.use('/signin', signinRouter);
router.use('/logout', logoutRouter);

exports.router = router;
