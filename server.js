const connectDb = require('./src/config/db')
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

app.use(
  session({
    secret: 'secret-word',
    key: 'session-key',
    cookie: {
      path: '/',
      httpOnly: true,
      maxAge: null,
    },
    saveUninitialized: false,
    resave: false,
  })
)
app.use(flash())
require('./src/config/config-passport')
app.use(passport.initialize())
app.use(passport.session())

const tasksRoutes = require('./src/routes/tasksRoutes')
const authRoutes = require('./src/routes/authRoutes')

const errorHandler = require('./src/middlewares/errorHandler')
const errorRoutesHandler = require('./src/middlewares/errorRoutesHandler')

//setRoutes
app.use('/api/tasks', tasksRoutes)
app.use('/api/auth', authRoutes)

app.use('*', errorRoutesHandler)
app.use(errorHandler)

const runApp = async () => {
  try {
    app.listen(PORT, () => {
      console.log(`Server is running on port: ${PORT}`)
    })
  } catch (error) {
    console.log(`Server not running. Error message: ${err.message}`)
    process.exit(1)
  }
}

const { PORT = 3030 } = process.env
connectDb()
runApp()
