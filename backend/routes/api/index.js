const router = require('express').Router();
const sessionRouter = require('./sessions');
const usersRouter = require('./users');
const spotsRouter = require('./spots');
const reviewRouter = require('./reviews');

const { setTokenCookie, restoreUser, requireAuth } = require('../../utils/auth.js');

router.use(restoreUser);
router.use('/session', sessionRouter);
router.use('/users', usersRouter);
router.use('/spots', spotsRouter);
router.use('/reviews', reviewRouter);

router.post('/test', (req, res) => {
  res.json({ requestBody: req.body });
});


module.exports = router;
