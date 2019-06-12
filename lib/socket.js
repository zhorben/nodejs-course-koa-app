const socketIO = require('socket.io');

const Session = require('../models/Session');
const Message = require('../models/Message');

function socket(server) {
  const io = socketIO(server);
  
  io.use(async function(socket, next) {
    const token = socket.handshake.query.token;
    
    if (!token) return next(new Error('anonymous sessions are not allowed'));
    
    const session = await Session.findOne({token}).populate('user');
    
    if (!token) return next(new Error('wrong or expired session token'));
    
    socket.user = session.user;
    
    next();
  });
  
  io.on('connection', function (socket) {
    socket.broadcast.emit('system_message', `${socket.user.name} connected`);
  
    socket.on('disconnect', () => {
      socket.broadcast.emit('system_message', `${socket.user.name} disconnected`);
    });
  
    socket.on('message', async msg => {
      const date = new Date();
      
      io.emit('user_message', {
        user: socket.user.name,
        text: msg,
        date: date
      });
    
      await Message.create({
        user: socket.user.id,
        text: msg,
        date: date,
      });
    });
  });
}

module.exports = socket;
