const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next()
  }
  req.flash('message', 'Log in please')
  res.redirect('/')
}

module.exports = isLoggedIn
