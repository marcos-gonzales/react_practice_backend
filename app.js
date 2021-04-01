const express = require('express');
const port = process.env.PORT || 4000;
const router = require('./routes/routes');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const session = require('express-session');
const db = require('./db/db');
const User = require('./db/user');
const Message = require('./db/message');
const sequelize = require('./db/db');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const store = new SequelizeStore({
  db: sequelize,
});

const server = require('http').createServer(app);
const io = require('socket.io')(server);

io.on('connection', () => {
  console.log('connected');
});

User.hasMany(Message);
Message.belongsTo(User);

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

app.listen(port, () => {
  console.log('listening on port ' + port);
  db.sync({
    // force: true,
    logging: false,
  });
});
