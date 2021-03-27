const db = require('../db/db');
const User = require('../db/user');
const Message = require('../db/message');
const { validationResult } = require('express-validator');

exports.getAllUsers = async (req, res, next) => {
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
  console.log('went here');
  console.log(req);
  console.log(req.params);
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

exports.postSendMessage = (req, res, next) => {};
