module.exports = (err, req, res, next) => {
  console.log(err.stack)
  const statusCode = res.statusCode || 500

  res.status(statusCode).json({
    code: statusCode,
    error: err.stack,
    message: err.message,
    data: 'Internal Server Error',
  })
}
