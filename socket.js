const socketIO = require('socket.io');

const Session = require('./models/Session');
const Message = require('./models/Message');

function socket(server) {
  const io = socketIO(server);
  
  io.use(async function(socket, next) {
    const token = socket.handshake.query.token;
    
    if (!token) return next(new Error('anonymous sessions are not allowed'));
    
    const session = await Session.findOne({token}).populate('user');
    
    if (!session) return next(new Error('wrong or expired session token'));

    socket.user = session.user;
    
    next();
  });

  io.on('connection', function (socket) {
    socket.on('message', async msg => {
      const message = new Message({
        date: new Date(),
        text: msg,
        user: socket.user,
      });
      
      socket.emit('message', {
        id: message.id,
        author: socket.user.displayName,
        time: `${message.date.getHours()}:${message.date.getMinutes()}`,
        text: msg,
      });
      
      setTimeout(async () => {
        
        const answer = await Message.create({
          date: new Date(),
          text: 'Вас приветствует бот AnyShop.',
          user: ''
        });
        
      }, 1000);
      
      await message.save();
    });
  });
  
  return io;
}

module.exports = socket;
