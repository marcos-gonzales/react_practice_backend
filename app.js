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

const server = require('http').createServer(app);
const options = {
  cors: true,
  origins: ['http://127.0.0.1:3000'],
  'force new connection': true,
};
const io = require('socket.io')(server, options);

io.on('connection', (socket) => {
  const currentlyConnected = [];
  currentlyConnected.push(socket.id);
  console.log(currentlyConnected);
  console.log('connecting..', socket.id);

  socket.on('chat', (chat) => {
    console.log(chat);
  });

  socket.on('new_message', (data) => {
    io.sockets.emit('new_message', data);
  });
  socket.on('remove', (socket) => {
    console.log('user disconnected!');
  });
});

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

app.use(router);

server.listen(port, () => {
  console.log('listening on port ' + port);
  db.sync({
    // force: true,
    logging: false,
  });
});
