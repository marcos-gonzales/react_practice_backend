const express = require('express')
const router = express.Router()
const chatroomController = require('../controller/chatroom')
const { body } = require('express-validator')

router.get('/createuser', chatroomController.getUser)

router.post(
  '/createuser',
  body('username')
    .isLength({ min: 3 })
    .withMessage('oops username must be at least 3 characters in length'),
  body('password')
    .isLength({ min: 5 })
    .withMessage('oops password must have 5 characters'),

  chatroomController.createUser
)

router.post('/signin', chatroomController.postSignin)

module.exports = router
