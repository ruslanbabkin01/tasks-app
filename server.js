const app = require('./app')
const path = require('path')
const { createFolderIsNotExist } = require('./src/helpers')
const connectDb = require('./src/config/db')

// шлях де зберігається файл при початковому завантаженні
const uploadDir = path.join(process.cwd(), 'uploads')
// шлях де зберігається файл остаточно
const storeImage = path.join(process.cwd(), 'images')

const { PORT = 3030 } = process.env

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

connectDb()
runApp()
