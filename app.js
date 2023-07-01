const express = require('express')
const cors = require('cors')
const logger = require('morgan')
// const flash = require('connect-flash')
// const session = require('express-session')
const passport = require('passport')
const path = require('path')
require('dotenv').config()

const app = express()

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short'
app.use(logger(formatsLogger))

app.use(express.json())
app.use(cors())

app.use(express.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))
app.use(passport.initialize())
require('./src/config/config-passport-jwt')

// app.use(
//   session({
//     secret: 'secret-word',
//     key: 'session-key',
//     cookie: {
//       path: '/',
//       httpOnly: true,
//       maxAge: null,
//     },
//     saveUninitialized: false,
//     resave: false,
//   })
// )
// app.use(flash())
// require('./src/config/config-passport-local')
// app.use(passport.session())

const { errorRoutesHandler, errorHandler } = require('./src/middlewares')
const { authRenderRouter, tasksRouter, authRouter } = require('./src/routes')

app.use('/', authRenderRouter)
app.use('/auth', authRouter)
app.use('/tasks', tasksRouter)

app.use('*', errorRoutesHandler)
app.use(errorHandler)

module.exports = app
