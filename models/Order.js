const mongoose = require('mongoose');
const connection = require('../libs/connection');

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: 'User',
  }
  
});

module.exports = connection.model('Order', orderSchema);
