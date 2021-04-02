const express = require('express');
const port = process.env.PORT || 4000;
const router = require('./routes/routes');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const session = require('express-session');
app.use('*', cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(
  session({
    secret: 'cutiewithabooty',
    resave: true,
    saveUninitialized: true,
  })
);
app.use(router);

const db = require('./db/db');
const User = require('./db/user');
const Message = require('./db/message');
const sequelize = require('./db/db');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const store = new SequelizeStore({
  db: sequelize,
});

User.hasMany(Message);
Message.belongsTo(User);

require('events').EventEmitter.prototype._maxListeners = 70;
require('events').defaultMaxListeners = 70;

const server = require('http').createServer(app);
const options = {
  cors: true,
  origins: ['http://127.0.0.1:3000'],
};
const io = require('socket.io')(server, options);

io.on('connection', (socket) => {
  console.log('connecting..');

  socket.on('message', (message) => {
    console.log('-------------message', message);
  });
  socket.emit('updateBubbles', { message: true });

  socket.on('remove', () => {
    console.log('user disconnected!');
  });
});

server.listen(port, () => {
  console.log('listening on port ' + port);
  db.sync({
    // force: true,
    logging: false,
  });
});
