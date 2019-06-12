const mongoose = require('../lib/mongoose');

const messageSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },

  text: {
    type: String,
    required: true,
  },
  
  date: {
    type: Date,
    required: true,
  }
  
});

module.exports = mongoose.model('Message', messageSchema);
