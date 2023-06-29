const express = require('express')
const router = express.Router()
const ctrlTask = require('../controllers/TasksController')
const isLoggedIn = require('../middlewares/isLoggedIn')

router.get('/', isLoggedIn, ctrlTask.get)

router.get('/:id', isLoggedIn, ctrlTask.getById)

router.post('/', isLoggedIn, ctrlTask.create)

router.put('/:id', isLoggedIn, ctrlTask.update)

router.patch('/:id/status', isLoggedIn, ctrlTask.updateStatus)

router.delete('/:id', isLoggedIn, ctrlTask.remove)

module.exports = router
