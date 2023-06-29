const passport = require('passport')
const passportJWT = require('passport-jwt')
const User = require('../service/schemas/user')
require('dotenv').config()

// Якщо стратегія аутентифікації не спрацьовує - відправиться відповідь 401 Unauthorized (Неавторизований)
// Стратегія JWT налаштована так, щоб читати JWT-токен із заголовка HTTP Authorization (авторизації) для кожного вхідного запиту

const ExtractJWT = passportJWT.ExtractJwt
const JwtStrategy = passportJWT.Strategy
const params = {
  secretOrKey: process.env.SECRET_KEY,
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
}

// в payload знаходиться id користувача.Потім звертаємося до БД і шукаємо користувача з id і:
// - або повертаємо об'єкт користувача
// - або помилку якщо користувач не був знайдений
passport.use(
  new JwtStrategy(params, async (jwt_payload, done) => {
    try {
      const user = await User.findOne({ _id: jwt_payload.id })
      if (user) {
        return done(null, user)
      } else {
        return done(new Error('User not found'), false)
      }
    } catch (err) {
      return done(err, false)
    }
  })
)
