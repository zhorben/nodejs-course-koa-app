const mongoose = require('mongoose');
const connection = require('../libs/connection');

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  
  description: {
    type: String,
    required: true,
  }
  
});

productSchema.index({ title: 'text', description: 'text' });

module.exports = connection.model('Product', productSchema);
