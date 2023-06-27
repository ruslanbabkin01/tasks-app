const express = require('express')
const router = express.Router()
const isLoggedIn = require('../middlewares/isLoggedIn')
const ctrlAuth = require('../controllers/AuthController')

router.get('/', ctrlAuth.home)

router.post('/login', ctrlAuth.login)

router.get('/register', ctrlAuth.registerPage)

router.post('/register', ctrlAuth.register)

router.get('/profile', isLoggedIn, ctrlAuth.profile)

router.get('/logout', ctrlAuth.logout)

module.exports = router
