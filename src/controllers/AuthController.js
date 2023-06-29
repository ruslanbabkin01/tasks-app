const passport = require('passport')
const User = require('../service/schemas/user')

class AuthController {
  home = async (req, res, next) => {
    res.render('index', { message: req.flash('message') })
  }

  login = async (req, res, next) => {
    passport.authenticate('local', (err, user) => {
      if (err) {
        return next(err)
      }
      if (!user) {
        req.flash('message', 'Enter the correct username and password!')
        return res.redirect('/')
      }
      req.logIn(user, function (err) {
        if (err) {
          return next(err)
        }
        return res.redirect('/profile')
      })
    })(req, res, next)
  }

  registerPage = async (req, res, next) => {
    res.render('register', { message: req.flash('message') })
  }

  register = async (req, res, next) => {
    const { username, email, password } = req.body
    try {
      //create user and enter data
      const user = await User.findOne({ email })

      // if user already exist send message
      if (user) {
        //  throw RequestError(409, 'Email in use')
        req.flash('message', 'User with this Email already exists')
        return res.redirect('/')
      }

      const newUser = new User({ username, email })
      newUser.setPassword(password)

      //else added user in db
      await newUser.save()
      req.flash('message', 'You have successfully registered')
      res.redirect('/profile')
    } catch (e) {
      next(e)
    }
  }

  profile = async (req, res, next) => {
    const { username, email } = req.user
    res.render('profile', { username, email })
  }

  logout = async (req, res) => {
    req.logout(function (err) {
      if (err) {
        return next(err)
      }
      res.redirect('/')
    })
  }
}

module.exports = new AuthController()
