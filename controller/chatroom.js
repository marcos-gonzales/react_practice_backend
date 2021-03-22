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




