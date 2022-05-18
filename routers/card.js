const router = require('express').Router();
const {
  getCard, createCard, deleteCard, likeCard, deleteLike,
} = require('../controllers/card');

router.get('/card', getCard);
router.post('/card', createCard);
router.delete('/cards/:cardId', deleteCard);
router.put('/cards/:cardId/likes', likeCard);
router.delete('/cards/:cardId/likes', deleteLike);

module.exports = router;
