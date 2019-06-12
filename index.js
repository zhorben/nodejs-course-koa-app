const config = require('config');
const app = require('./app');
const socket = require('./lib/socket');

const server = app.listen(config.get('port'), () => {
  console.log(`server is running on http://localhost:${config.get('port')}`);
});

socket(server);
