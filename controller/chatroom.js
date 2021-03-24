const db = require('../db/db');
const User = require('../db/user');
const Message = require('../db/message');
const { validationResult } = require('express-validator');

exports.getAllUsers = async (req, res, next) => {
  let findMessage = await Message.findAll().then((message) => {
    console.log(message);
  });
  let findUsers = await User.findAll().then((user) => {});
  console.log(findMessage);
  console.log(findUsers);
};

exports.getUser = (req, res, next) => {
  console.log(req);
  console.log(req.params);
  Message.findAll({ where: { userId: req.params.userid } }).then((messages) => {
    console.log(messages);
  });
};
