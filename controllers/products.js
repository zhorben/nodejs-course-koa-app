"use strict";

const Product = require('../models/Product');

module.exports = async function products(ctx, next) {
  const {categoryId} = ctx.query;
  ctx.body = await Product.find({$or: [{category: categoryId}, {subcategory: categoryId}]});
};
