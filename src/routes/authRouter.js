const express = require('express')
const router = express.Router()
const ctrlAuth = require('../controllers/AuthController')
const { auth } = require('../middlewares')

router.post('/login', ctrlAuth.login)

router.post('/register', ctrlAuth.register)

router.post('/logout', auth, ctrlAuth.logout)

module.exports = router
