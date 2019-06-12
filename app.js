const Koa = require('koa');
const Router = require('koa-router');
const cors = require('@koa/cors');
const logger = require('koa-logger');
const bodyParser = require('koa-bodyparser');

const Session = require('./models/Session');
const mustBeAuthenticated = require('./lib/mustBeAuthenticated');

const app = module.exports = new Koa();

const router = new Router({ prefix: '/api' });

router.use(async (ctx, next) => {
  const token = ctx.query.token;
  if (!token) return next();
  
  const session = await Session.findOne({token}).populate('user');
  if (!session) return next();
  
  ctx.user = session.user;
  return next();
});

router.post('/login', require('./controllers/login'));
router.post('/register', require('./controllers/register'));
router.post('/confirm', require('./controllers/confirm'));
router.post('/oauth', require('./controllers/oauth').oauth);
router.post('/oauth_callback', require('./controllers/oauth').oauth_callback);

router.get('/messages', mustBeAuthenticated, require('./controllers/messages'));

app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    if (err.status) {
      ctx.status = err.status;
      ctx.body = { error: err.error };
      return;
    }
    
    console.error(err);
    ctx.status = 500;
    ctx.body = { error: 'Internal server error' };
  }
});

app.use(bodyParser());
app.use(logger());
app.use(cors());
app.use(router.routes());
