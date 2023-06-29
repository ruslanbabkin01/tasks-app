const passport = require('passport')
const passportJWT = require('passport-jwt')
const User = require('../service/schemas/user')
require('dotenv').config()
const secret = process.env.SECRET_KEY

const ExtractJWT = passportJWT.ExtractJwt
const JwtStrategy = passportJWT.Strategy
const params = {
  secretOrKey: secret,
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
}

passport.use(
  new JwtStrategy(params, function (jwt_payload, done) {
    User.findOne({ _id: jwt_payload.id }, function (err, user) {
      if (err) {
        return done(err, false)
      }
      if (user) {
        return done(null, user)
      } else {
        return done(null, false)
        // or you could create a new account
      }
    })
  })
)

// JWT Strategy
// passport.use(
//   new JwtStrategy(params, function (payload, done) {
//     User.findOne({ _id: payload.id })
//       .then(([user]) => {
//         if (!user) {
//           return done(new Error('User not found'))
//         }
//         return done(null, user)
//       })
//       .catch(err => done(err))
//   })
// )
