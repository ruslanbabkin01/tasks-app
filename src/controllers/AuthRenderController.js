const passport = require('passport')
const User = require('../service/schemas/user')
const { upload } = require('../middlewares')
const formidable = require('formidable')
const path = require('path')
const fs = require('fs').promises
const parseFrom = require('../helpers')

class AuthRenderController {
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

  upload = async (req, res, next) => {
    const uploadDir = path.join(process.cwd(), 'uploads')
    // шлях де зберігається файл остаточно
    const storeImage = path.join(process.cwd(), 'images')

    // створюємо екземпляр formidable
    const form = formidable({ uploadDir, maxFileSize: 2 * 1024 * 1024 })

    const { fields, files } = await parseFrom(form, req)

    // припускаємо, що ім'я поля з файлом дорівнює picture.Отримуємо шлях де знаходиться файл temporaryName і його оригінальне ім'я name
    const { path: temporaryName, name } = files.picture
    const { description } = fields

    // даємо нове ім'я файлу, у нашому випадку залишаємо його тим самим
    const fileName = path.join(storeImage, name)

    // переносимо файл у постійне сховище
    try {
      await fs.rename(temporaryName, fileName)
    } catch (err) {
      // Якщо сталася помилка перенесення - видаляємо тимчасовий файл
      await fs.unlink(temporaryName)
      return next(err)
    }

    res.json({
      description,
      message: 'File uploaded successfully',
      status: 200,
    })
  }
}

module.exports = new AuthRenderController()
