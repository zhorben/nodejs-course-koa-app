/**
 *  body : {
 *    products: string[],
 *    phone: string
 *    address: string
 *  }
 */
const Order = require('../models/Order');

async function checkout(ctx, next) {
  ctx.body = await Order.create({
    ...ctx.request.body,
    user: ctx.user.id,
  });
}

async function list(ctx, next) {
  ctx.body = await Order.find({user: ctx.user.id})
}

module.exports = {
  checkout,
  list
};
