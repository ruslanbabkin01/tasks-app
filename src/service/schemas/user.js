const mongoose = require('mongoose')
const bCrypt = require('bcryptjs')

const Schema = mongoose.Schema

const userSchema = new Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
  },
  email: {
    type: String,
    required: [true, 'Email required'],
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'Password required'],
  },
  token: {
    type: String,
    default: null,
  },
})

userSchema.methods.setPassword = function (password) {
  this.password = bCrypt.hashSync(password, bCrypt.genSaltSync(6))
}

userSchema.methods.verifyPassword = function (password) {
  return bCrypt.compareSync(password, this.password)
}

const User = mongoose.model('user', userSchema)

module.exports = User
