const products = require('../data/products.json');

module.exports = products.map(product => ({
  ...product,
  price: parseInt(product.price),
  images: product.images.map(image => ({url: image})),
}));
