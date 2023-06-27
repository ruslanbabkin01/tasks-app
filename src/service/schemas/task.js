const mongoose = require('mongoose')
const Schema = mongoose.Schema

const task = new Schema(
  {
    title: {
      type: String,
      minlength: 2,
      maxlength: 70,
      required: [true, 'Please provide all required fields'],
    },
    text: {
      type: String,
      minlength: 3,
      maxlength: 170,
      required: [true, 'Please provide all required fields'],
    },
    isDone: {
      type: Boolean,
      default: false,
    },
  },
  { versionKey: false, timestamps: true }
)

const Task = mongoose.model('task', task)

module.exports = Task
