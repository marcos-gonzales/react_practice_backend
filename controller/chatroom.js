const db = require('../db/db')
const User = require('../db/user')
const Message = require('../db/message')
const { validationResult } = require('express-validator')

exports.getUser = (req, res, next) => {
  db.query(`SELECT * FROM user  `, (err, results, fields) => {
    if (err) console.log(err)
    console.log(results)
    res.json(results)
  })
}

exports.createUser = (req, res, next) => {
  const username = req.body.username
  const password = req.body.password
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  User.create({
    username: username,
    password: password,
  })
    .then((user) => {
      user.save()
      console.log('user saved.', user)
      res.json({ message: 'Successfully created user' })
    })
    .catch((err) => {
      if (err) {
        console.log(err)
        res.json({ message: 'oops something went wrong.' })
      }
    })
}

exports.postSignin = (req, res, next) => {
  const username = req.body.signInUsername
  const password = req.body.signInPassword

  User.findOne({
    where: {
      username: username,
      password: password,
    },
  }).then((user) => {
    if (!user) {
      console.log('no users with that password')
      res.json({ errorMessage: 'Invalid credentials.' })
    } else {
      console.log('success', user)
      res.json({ successMessage: 'You have successfully logged in.' })
      console.log(req.user)
      console.log(user)
      console.log(User)
      return user
    }
  })
}
