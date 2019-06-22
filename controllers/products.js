"use strict";

const Product = require('../models/Product');

module.exports = async function products(ctx, next) {
  const {category} = ctx.query;
  const products = await Product.find({$or: [{category: category}, {subcategory: category}]});
  
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
