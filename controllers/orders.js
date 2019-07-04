const Order = require('../models/Order');

module.exports = async function checkout(ctx, next) {
  const order = await Order.create({
    user: ctx.user,
    product: ctx.request.body.product,
    phone: ctx.request.body.phone,
    address: ctx.request.body.address,
  });
  
  ctx.body = {order: order.id};
};
