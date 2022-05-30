const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  name: {
    required: true,
    minlength: 2,
    maxlength: 30,
    type: String,
    validate: /[\wа-яА-ЯЁёё-]+/,
  },
  link: {
    required: true,
    type: String,
    validate: /^[A-Z0-9._%+-]+@[A-Z0-9-]+.+.[A-Z]{2,4}$/,
  },
  owner: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: 'user',
  },
  likes: [{
    type: mongoose.Types.ObjectId,
    required: true,
    ref: 'user',
  }],
  createAt: {
    type: Date,
    required: true,
    default: Date.now(),
  },
});

module.exports = mongoose.model('card', cardSchema);
