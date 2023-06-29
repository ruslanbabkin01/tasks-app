module.exports = (req, res, next) => {
  res.status(404).json({
    status: 'error',
    code: 404,
    message: 'Use api on routes: /register',
    data: 'Not found',
  })
}
