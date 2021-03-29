const db = require('../db/db');
const User = require('../db/user');
const Message = require('../db/message');
const { validationResult } = require('express-validator');

exports.getAllUsers = async (req, res, next) => {
  User.findAll()
    .then((user) => {
      if (!user) {
        res.json({ message: 'oops no users' });
        return next();
      }
      res.json({ messages: user });
      console.log(user);
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getAllMesssages = (req, res, next) => {
  Message.findAll()
    .then((messages) => {
      if (!messages) {
        console.log('oops no messages');
        res.json({ message: 'oops no messages' });
        return next();
      }
      console.log(messages);
      res.json({ message: messages });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getUser = (req, res, next) => {
  Message.findAll({ where: { userId: req.params.userid } })
    .then((userAndMessage) => {
      if (!userAndMessage) {
        res.json({ message: 'oops something went wrong.' });
        return next();
      }
      console.log(userAndMessage);
      res.json({ message: userAndMessage, user: userAndMessage });
    })
    .catch((err) => {
      console.log(err);
      return err;
    });
};

exports.postSendMessage = (req, res, next) => {
  const message = req.body.userMessage;
  const userId = req.params.userid;
  console.log(req.params);
  Message.create({
    message: message,
    userId: userId,
  })
    .then((message) => {
      console.log(message);
      res.json({ message: 'success!', message: message });
    })
    .catch((err) => {
      console.log(err);
      res.json({ message: 'something went wrong.' });
    });
};
