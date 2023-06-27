const express = require('express')
const router = express.Router()
const ctrlTask = require('../controllers/TasksController')

router.get('/', ctrlTask.get)

router.get('/:id', ctrlTask.getById)

router.post('/', ctrlTask.create)

router.put('/:id', ctrlTask.update)

router.patch('/:id/status', ctrlTask.updateStatus)

router.delete('/:id', ctrlTask.remove)

module.exports = router
