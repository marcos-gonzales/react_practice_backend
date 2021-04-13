require('dotenv').config();
const db = require('../db/db');
const User = require('../db/user');
const Message = require('../db/message');
const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const sgMail = require('@sendgrid/mail');

exports.createUser = (req, res, next) => {
  console.log(req.body);
  const username = req.body.username;
  const email = req.body.email;
  const password = req.body.password;
  const errors = validationResult(req);
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  const msg = {
    to: email,
    from: 'markymarrk@gmail.com',
    subject: 'Welcome!',
    text: `Hello ${username} get ready for lots of fun!`,
    html: `<strong>Please refer below to our terms and conditions</strong> <p>Hello ${username}.</p>`,
  };

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  return bcrypt
    .hash(password, saltRounds)
    .then((hash) => {
      // Store hash in your password DB.
      return User.create({
        username: username,
        password: hash,
        email: email,
      });
    })
    .then((user) => {
      res.json({
        message: 'You have successfully created an account.',
        user: user,
        isLoggedIn: true,
      });
      return user.save();
    })
    .then((sendMail) => {
      //Sendgrid sends email to user that signed up.
      console.log('went in here.');
      sgMail.send(msg).then(
        () => {},
        (error) => {
          console.error(error);

          if (error.response) {
            console.error(error.response.body);
          }
        }
      );
    })
    .catch((err) => {
      console.log(err);
      res.json({ message: 'Oops something went wrong.' });
    });
};

exports.postSignin = (req, res, next) => {
  const password = req.body.signInPassword;
  const username = req.body.signInUsername;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  User.findOne({ where: { username: username } })
    .then((user) => {
      if (!user) {
        console.log('oops no user found.');
        res.json({ errorMessage: 'oops no user found.' });
        next();
      }
      return user;
    })
    .then((user) => {
      if (!user) next();
      bcrypt.compare(password, user.password).then((match) => {
        if (!user) return next();
        if (!match) {
          console.log('oops password is wrong.');
          res.json({ errorMessage: 'oops password does not match' });
          return next();
        }
        req.session.isLoggedIn = true;
        req.session.user = user;
        req.session.save((err) => {
          if (err) console.log(err);
          res.json({
            isLoggedIn: true,
            successMessage: 'you have logged in.',
            user: user,
          });
        });
      });
    })
    .catch((err) => {
      next();
      console.log(err);
    })
    .catch((err) => {
      next();
      console.log(err);
    });
};
