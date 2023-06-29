const passport = require('passport')
const passportJWT = require('passport-jwt')
const User = require('../service/schemas/user')
require('dotenv').config()
const secret = process.env.SECRET_KEY

// Якщо стратегія аутентифікації не спрацьовує - відправиться відповідь 401 Unauthorized (Неавторизований)
// Стратегія JWT налаштована так, щоб читати JWT-токен із заголовка HTTP Authorization (авторизації) для кожного вхідного запиту

const ExtractJWT = passportJWT.ExtractJwt
const JwtStrategy = passportJWT.Strategy
const params = {
  secretOrKey: secret,
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
}

// в payload знаходиться id користувача.Потім звертаємося до БД і шукаємо користувача з id і:
// - або повертаємо об'єкт користувача
// - або помилку якщо користувач не був знайдений
passport.use(
  new JwtStrategy(params, function (jwt_payload, done) {
    User.findOne({ _id: jwt_payload.id }, function (err, user) {
      if (err) {
        return done(err, false)
      }
      if (user) {
        return done(null, user)
      } else {
        return done(new Error('User not found'), false)
      }
    })
  })
)
