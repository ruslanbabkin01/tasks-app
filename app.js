const express = require('express')
const cors = require('cors')
const logger = require('morgan')
const flash = require('connect-flash')
const passport = require('passport')
const path = require('path')
const session = require('express-session')
require('dotenv').config()

const app = express()

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short'
app.use(logger(formatsLogger))

// parse application/json
app.use(express.json())
// cors
app.use(cors())

app.use(express.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))

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
require('./src/config/config-passport-jwt')
app.use(passport.initialize())
// app.use(passport.session())

const { errorRoutesHandler, errorHandler } = require('./src/middlewares')
const { authRenderRouter, tasksRouter, authRouter } = require('./src/routes')

//setRoutes
app.use('/', authRenderRouter)
app.use('/auth', authRouter)
app.use('/tasks', tasksRouter)

app.use('*', errorRoutesHandler)
app.use(errorHandler)

module.exports = app
