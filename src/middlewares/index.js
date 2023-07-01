const auth = require('./auth')
const isLoggedIn = require('./isLoggedIn')
const errorHandler = require('./errorHandler')
const errorRoutesHandler = require('./errorRoutesHandler')

module.exports = {
  auth,
  isLoggedIn,
  errorHandler,
  errorRoutesHandler,
}
