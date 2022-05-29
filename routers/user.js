const router = require('express').Router();
const {
  getUser, findUser, updataUser, updataAvatar, getMyUser,
} = require('../controllers/user');

router.get('/users/me', getMyUser);
router.get('/users', getUser);
router.get('/users/:userId', findUser);
router.patch('/users/me', updataUser);
router.patch('/users/me/avatar', updataAvatar);

module.exports = router;
