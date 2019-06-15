const Category = require('../models/Category');

module.exports = async function categories(ctx, next) {
  const categories = await Category.find();
  ctx.body = { categories };
};
