const express = require('express')
const router = express.Router()
const ctrlAuth = require('../controllers/AuthController')

router.post('/login', ctrlAuth.login)

router.post('/register', ctrlAuth.register)

module.exports = router
