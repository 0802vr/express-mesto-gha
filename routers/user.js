const router = require('express').Router();
const {
  getUser, createUser, findUser, updataUser, updataAvatar,
} = require('../controllers/user');

router.get('/users', getUser);
router.post('/users', createUser);
router.get('/users/:userId', findUser);
router.patch('/users/me', updataUser);
router.patch('/users/me/avatar', updataAvatar);

module.exports = router;
