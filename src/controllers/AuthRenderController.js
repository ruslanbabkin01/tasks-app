const passport = require('passport')
const User = require('../service/schemas/user')
const formidable = require('formidable')
const path = require('path')
const { parseForm } = require('../helpers')
const fs = require('fs').promises

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
        req.flash('message', 'Enter the correct name and password!')
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
    const { name, email, password } = req.body
    try {
      //create user and enter data
      const user = await User.findOne({ email })

      // if user already exist send message
      if (user) {
        //  throw RequestError(409, 'Email in use')
        req.flash('message', 'User with this Email already exists')
        return res.redirect('/')
      }

      const newUser = new User({ name, email })
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
    const { name, email } = req.user
    res.render('profile', { name, email })
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
    const { fields, files } = await parseForm(form, req)

    // ім'я поля з файлом name=picture. Отримуємо шлях де знаходиться файл temporaryName і його ім'я name
    const { filepath, originalFilename } = files.picture
    const { description } = fields

    // даємо нове ім'я файлу
    const newFileName = `${+new Date()}_${originalFilename}`
    const newFilePath = path.join(storeImage, newFileName)

    // переносимо файл у постійне сховище
    try {
      await fs.rename(filepath, newFilePath)
    } catch (err) {
      // Якщо помилка перенесення - видаляємо тимчасовий файл
      await fs.unlink(filepath)
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
