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

// exports.postSignin = (req, res, next) => {
//   const username = req.body.signInUsername
//   const password = req.body.signInPassword

//   User.findOne({
//     where: {
//       username: username,
//       password: password,
//     },
//   }).then((user) => {
//     if (!user) {
//       console.log('no users with that password')
//       res.json({ errorMessage: 'Invalid credentials.' })
//     } else {
//       console.log('success', user)
//       res.json({ successMessage: 'You have successfully logged in.' })
//       console.log(req.user)
//       console.log(user)
//       console.log(User)
//       return user
//     }
//   })
// };

exports.postSignin = (req, res, next) => {
  const password = req.body.signInPassword
  const username = req.body.signInUsername

  User.findOne({ where: {username: username}})
   .then(user => {
    if(!user) console.log('oops no user found.')
  return user
  })
  .then(user => {
    console.log(user)
    bcrypt.compare(password, user.password)
    .then(match => {
      if(!match) console.log('oops no match')
      console.log('success!!')
    })
  })
  .catch(err => console.log(err))
  .catch(err => console.log(err))
}
