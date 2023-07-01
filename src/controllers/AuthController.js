const User = require('../service/schemas/user')
const jwt = require('jsonwebtoken')
require('dotenv').config()

class AuthController {
  register = async (req, res, next) => {
    const { name, email, password } = req.body

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
      const newUser = new User({ name, email })
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
      })
    }

    const payload = {
      id: user._id,
      name: user.name,
    }

    const token = jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: '1d' })
    res.status(200).json({
      status: 'success',
      message: 'Logged in successfully!',
      code: 200,
      data: {
        token,
        email,
        name: user.name,
      },
    })
  }

  logout = async (req, res) => {
    const { _id } = req.user
    await User.findByIdAndUpdate(_id, { token: null })

    res.status(204).json({
      status: 'success',
      message: 'Logout success',
      code: 204,
    })
  }
}

module.exports = new AuthController()
