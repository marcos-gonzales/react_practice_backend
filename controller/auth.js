require('dotenv').config();
const db = require('../db/db');
const User = require('../db/user');
const Message = require('../db/message');
const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const crypto = require('crypto');

exports.createUser = (req, res, next) => {
  const username = req.body.username;
  const email = req.body.email;
  const password = req.body.password;
  const errors = validationResult(req);

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

exports.resetPassword = (req, res, next) => {
  const email = req.body.emailValue;
  const token = crypto.randomBytes(48).toString('hex');
  const msg = {
    to: email,
    from: 'markymarrk@gmail.com',
    subject: 'You sent a request to change passwords',
    text: `Hello, we received a request to change your password. Please click this link to <strong>Reset your password by clicking <a href="localhost:4000/resetpassword/${token}"</strong>`,
    html: `<p>Your reset token will expire in one hour. Better get to it..</p>
    <p>${token}</p>
    <br>
    <p>Hello, we received a request to change your password. Please copy and paste this token on chat.io where you sent the request <strong>${token}</strong></p>`,
  };

  User.findOne({
    where: {
      email: email,
    },
  }).then((user) => {
    if (!user) {
      res.json({ message: 'oops token doesnt match.' });
      return next();
    }
    // check current time
    let currentTime = Date.now();
    // add 1 hour from current time.
    let oneHourFromNow = currentTime + 3600;
    user.resetToken = currentTime;
    user.resetTokenExpiration = oneHourFromNow;
    user.save();
    res.json({
      url: token,
      userEmail: user.email,
      userResetToken: user.resetToken,
      userResetTokenExpiration: user.resetTokenExpiration,
      message:
        'We have sent an email to the address entered above. You may need to look in your spam folder.',
    });
  });
  sgMail
    .send(msg)
    .then(
      () => {},
      (error) => {
        console.error(error);
        if (error.response) {
          console.error(error.response.body);
        }
      }
    )
    .catch((err) => {
      if (err) console.log(err);
    });
};

exports.finalResetPassword = (req, res, next) => {
  const token = new Date();
  const expirationToken = req.body.user.userResetTokenExpiration;
  const email = req.body.user.userEmail;
  const newPassword = req.body.newPassword;
  console.log(token);
  console.log(expirationToken);
  // Check if the current date is less than 1 hour from when user received token.
  if (expirationToken > token) {
    User.findOne({
      where: {
        email: email,
      },
    }).then((user) => {
      if (!user) return next();
      bcrypt
        .hash(newPassword, saltRounds)
        .then((hash) => {
          // Store hash in your password DB.
          user.password = hash;
          user.resetToken = null;
          user.resetTokenExpiration = null;
          return user.save();
        })
        .then((main) => {
          res.json({
            user: user,
            message: 'You have successfully changed your password!!',
          });
        });
    });
  } else {
    res.json({
      message: 'Oops your token is expired.',
    });
  }
};
