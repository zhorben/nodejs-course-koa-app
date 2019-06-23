"use strict";

const Product = require('../models/Product');

module.exports = async function products(ctx, next) {
  const {category, query} = ctx.query;
  
  let products = [];
  if (category) {
    products = await Product.find({subcategory: category}).limit(20);
  } else if (query) {
    products = await Product
      .find({$text: { $search: query }}, { score: { $meta: 'textScore' } })
      .sort({ score: { $meta: 'textScore' } })
      .limit(20);
  } else {
    products = await Product.find().limit(20);
  }
  
  ctx.body = {products: products.map(product => ({
    id: product.id,
    title: product.title,
    images: product.images,
    category: product.category,
    subcategory: product.subcategory,
    price: product.price,
    description: product.description,
  }))}
};
