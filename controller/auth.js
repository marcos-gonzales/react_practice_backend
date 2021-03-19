const db = require('../db/db');
const User = require('../db/user');
const Message = require('../db/message');
const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const saltRounds = 10;

exports.createUser = (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  };

 return bcrypt.hash(password, saltRounds)
  .then((hash) => {
    // Store hash in your password DB.
  return  User.create({
      username: username,
      password: hash
    })
  })
  .then((user) => {
    user.save()
    res.json({message: 'You have successfully created an account.'})
    console.log(user)
  })
  .catch((err) => {
    console.log(err)
    res.json({message: 'Oops something went wrong.'})
  })
};
