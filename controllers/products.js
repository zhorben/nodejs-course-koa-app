const Product = require('../models/Product');
const compose = require('koa-compose');

function mapProducts(products) {
  return products.map(product => ({
    id: product.id,
    title: product.title,
    images: product.images,
    category: product.category,
    subcategory: product.subcategory,
    price: product.price,
    description: product.description,
  }));
}

async function productsByCategory(ctx, next) {
  const {category} = ctx.query;
  if (!category) return next();
  
  const products = await Product.find({subcategory: category}).limit(20);
  ctx.body = {products: mapProducts(products)};
}

async function productsByQuery(ctx, next) {
  const {query} = ctx.query;
  if (!query) return next();
  
  const products = await Product
    .find({$text: { $search: query }}, { score: { $meta: 'textScore' } })
    .sort({ score: { $meta: 'textScore' } })
    .limit(20);
  ctx.body = {products: mapProducts(products)};
}

async function productsList(ctx, next) {
  const products = await Product.find().limit(20);
  ctx.body = {products: mapProducts(products)};
}

module.exports = compose([
  productsByCategory,
  productsByQuery,
  productsList,
]);
