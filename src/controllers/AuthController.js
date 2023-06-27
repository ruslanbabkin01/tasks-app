const bcrypt = require('bcrypt')
const generateToken = require('../../helpers/generateToken')

const usersModel = require('../service/schemas/task')
const rolesModel = require('../service/schemas/rolesModel')

class AuthController {
  // Реєстрація - збереження користувача в базі даних
  register = async (req, res, next) => {
    // отримуємо дані від користувача і валідуємо
    const { password, email } = req.body

    if (!password || !email) {
      res.status(400)
      throw new Error('Please, provide all required fields')
    }

    // перевіряємо чи є такий користувач в БД
    const candidate = await usersModel.findOne({ email })

    // якщо є - повідомляємо що такий користувач вже існує
    if (candidate) {
      res.status(400)
      throw new Error('User already exists')
    }

    // якщо нема - хешуємо пароль
    const hash = bcrypt.hashSync(password, 5)

    // зберігаємо користувача в БД
    const role = await rolesModel.findOne({ value: 'USER' })
    const user = await usersModel.create({
      ...req.body,
      password: hash,
    })

    user.roles.push(role.value)
    await user.save()

    if (!user) {
      res.status(400)
      throw new Error('Unable to save user')
    }

    res.status(201).json({
      code: 201,
      message: 'success',
      data: {
        email: user.email,
        name: user.name,
        roles: user.roles,
      },
    })
  }

  // Автентифікація - перевірка даних, що ввів користувач з тим що є в базі даних
  login = async (req, res, next) => {
    // отримуємо дані від користувача і валідуємо
    const { password, email } = req.body

    if (!password || !email) {
      res.status(400)
      throw new Error('Please, provide all required fields')
    }
    // шукаємо користувача в бд і перевіряємо пароль на валідність
    const user = await usersModel.findOne({ email })
    const correctPassword = bcrypt.compareSync(password, user.password)

    // якщо не знайшли, чи не валідний пароль - кидаємо помилку
    if (!user || !correctPassword) {
      res.status(400)
      throw new Error('Invalid email or password')
    }
    // якщо знайшли і валідний, то видаємо токен
    const token = generateToken(user._id)
    user.token = token
    const isUpdatedToken = await user.save()
    if (!isUpdatedToken) {
      res.status(400)
      throw new Error('Unable to set token')
    }

    res.status(200).json({
      code: 200,
      message: 'success',
      data: {
        email: user.email,
        token: user.token,
      },
    })
  }

  // Логаут - вихід із системи
  logout = async (req, res, next) => {
    const { _id } = req.user
    const user = await usersModel.findByIdAndUpdate(_id, { token: null })

    if (!user) {
      res.status(400)
      throw new Error('Unable to logout')
    }

    res.status(200).json({
      code: 200,
      message: 'logout success',
    })
  }
}

module.exports = new AuthController()
