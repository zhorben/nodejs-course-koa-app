const app = require('./app');
const socket = require('./socket');

const server = app.listen(3001, () => {
  console.log('App is running on http://localhost:3001');
});

socket(server);
