const express = require('express')
const app = express()
const port = process.env.PORT || 4000
const router = require('./routes/routes')
const cors = require('cors')
const bodyParser = require('body-parser')
const session = require('express-session')
const db = require('./db/db')
const User = require('./db/user')
const Message = require('./db/message')
User.hasMany(Message)

app.use('*', cors())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(router)
app.use(
  session({
    secret: 'cutiewithabooty',
    resave: true,
    saveUninitialized: true
  })
)

app.get('/', (req, res) => {
  res.send('hello from express ;)')
})

app.listen(port, () => {
  console.log('listening on port ' + port)
  db.sync({
    // force: true,
    logging: false
  })
})
