const express = require('express')
const cors = require('cors')
const logger = require('morgan')
const app = express()
require('dotenv').config()

const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short'
app.use(logger(formatsLogger))

// parse application/json
app.use(express.json())
// cors
app.use(cors())
app.use(express.urlencoded({ extended: false }))

const connectDb = require('./src/config/db')

const tasksRoutes = require('./src/routes/tasksRoutes')
// const authRoutes = require('./src/routes/authRoutes')

const errorHandler = require('./src/middlewares/errorHandler')
const errorRoutesHandler = require('./src/middlewares/errorRoutesHandler')

//setRoutes
app.use('/api/tasks', tasksRoutes)
// app.use('/api/auth', authRoutes)

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
