const Session = require('../models/Session');

module.exports = function mustBeAuthenticated(ctx, next) {
  if (!ctx.user) ctx.throw(401);
  return next();
};
