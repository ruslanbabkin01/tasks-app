const User = require('../service/schemas/user')
const jwt = require('jsonwebtoken')
require('dotenv').config()

class AuthController {
  register = async (req, res, next) => {
    const { username, email, password } = req.body
    const user = await User.findOne({ email })
    if (user) {
      return res.status(409).json({
        status: 'error',
        code: 409,
        message: 'Email is already in use',
        data: 'Conflict',
      })
    }
    try {
      const newUser = new User({ username, email })
      newUser.setPassword(password)
      await newUser.save()
      res.status(201).json({
        status: 'success',
        code: 201,
        message: 'Registration successful',
      })
    } catch (error) {
      next(error)
    }
  }

  login = async (req, res, next) => {
    const { email, password } = req.body
    const user = await User.findOne({ email })

    if (!user || !user.verifyPassword(password)) {
      return res.status(400).json({
        status: 'error',
        code: 400,
        message: 'Incorrect login or password',
        data: 'Bad request',
      })
    }

    const payload = {
      id: user.id,
      username: user.username,
    }

    const token = jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: '1h' })
    res.json({
      status: 'success',
      code: 200,
      token,
    })
  }
}

module.exports = new AuthController()
