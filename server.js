const connectDb = require('./src/config/db')
const express = require('express')
const cors = require('cors')
const logger = require('morgan')
const flash = require('connect-flash')
const passport = require('passport')
const path = require('path')
const fs = require('fs').promises
const session = require('express-session')
const formidable = require('formidable')
require('dotenv').config()
const app = express()

const parseFrom = require('./src/helpers')

const uploadDir = path.join(process.cwd(), 'uploads')
const storeImage = path.join(process.cwd(), 'images')

//router for upload avatar
app.post('/upload', async (req, res, next) => {
  const form = formidable({ uploadDir, maxFileSize: 2 * 1024 * 1024 })

  const { fields, files } = await parseFrom(form, req)
  const { path: temporaryName, name } = files.picture
  const { description } = fields

  const fileName = path.join(storeImage, name)
  try {
    await fs.rename(temporaryName, fileName)
  } catch (err) {
    await fs.unlink(temporaryName)
    return next(err)
  }
  res.json({ description, message: 'File uploaded successfully', status: 200 })
})

const isAccessible = path => {
  return fs
    .access(path)
    .then(() => true)
    .catch(() => false)
}

const createFolderIsNotExist = async folder => {
  if (!(await isAccessible(folder))) {
    await fs.mkdir(folder)
  }
}

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
require('./src/config/config-passport-local')
app.use(passport.initialize())
app.use(passport.session())

const tasksRoutes = require('./src/routes/tasksRoutes')
const authRoutes = require('./src/routes/authRoutes')

const errorHandler = require('./src/middlewares/errorHandler')
const errorRoutesHandler = require('./src/middlewares/errorRoutesHandler')

//setRoutes
app.use('/tasks', tasksRoutes)
app.use('/', authRoutes)

app.use('*', errorRoutesHandler)
app.use(errorHandler)

const runApp = async () => {
  try {
    app.listen(PORT, () => {
      console.log(`Server is running on port: ${PORT}`)
      createFolderIsNotExist(uploadDir)
      createFolderIsNotExist(storeImage)
    })
  } catch (error) {
    console.log(`Server not running. Error message: ${err.message}`)
    process.exit(1)
  }
}

const { PORT = 3030 } = process.env
connectDb()
runApp()
