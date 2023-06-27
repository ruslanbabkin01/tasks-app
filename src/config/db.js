const mongoose = require('mongoose')
mongoose.set('strictQuery', false)

const connectDb = async () => {
  try {
    const db = await mongoose.connect(process.env.DB_HOST, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    })
    console.log(
      `Database is connected: ${db.connection.name}, on port: ${db.connection.port}, on host: ${db.connection.host}`
    )
  } catch (error) {
    console.log(error.message)
    mongoose.disconnect()
  }
}

module.exports = connectDb
