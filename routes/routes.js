const express = require('express');
const router = express.Router();
const chatroomController = require('../controller/chatroom');
const authController = require('../controller/auth');
const { body } = require('express-validator');

router.get('/createuser', chatroomController.getUser);

router.post(
  '/createuser',
  body('username')
    .isLength({ min: 3 })
    .withMessage('oops username must be at least 3 characters in length'),
  body('password')
    .isLength({ min: 5 })
    .withMessage('oops password must have 5 characters'),

  authController.createUser
);

router.post(
  '/signin',
  body('signInUsername')
    .isLength({ min: 3 })
    .withMessage('oops username needs at least 5 characters'),
  body('signInPassword')
    .isLength({ min: 5 })
    .withMessage('oops password needs to be at least 5 characters'),

  authController.postSignin
);

module.exports = router;
