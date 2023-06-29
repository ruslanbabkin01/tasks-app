const { isValidObjectId } = require('mongoose')
const service = require('../service')

class TasksController {
  get = async (req, res, next) => {
    const { username } = req.user
    try {
      const results = await service.getAlltasks()

      if (!results) {
        res.status(400)
        throw new Error('Unable get data')
      }

      return res.status(200).json({
        code: 200,
        status: 'success',
        data: results,
        message: `Authorization was successful: ${username}`,
        qty: results.length,
      })
    } catch (e) {
      console.error(e)
      next(e)
    }
  }

  create = async (req, res, next) => {
    const { title, text } = req.body
    try {
      const result = await service.createTask({ title, text })

      if (!result) {
        res.status(400)
        throw new Error('Unable to save to database')
      }

      res.status(201).json({
        status: 'success',
        code: 201,
        data: result,
      })
    } catch (e) {
      console.error(e)
      next(e)
    }
  }

  getById = async (req, res, next) => {
    const { id } = req.params
    if (!isValidObjectId(id)) {
      res.status(400)
      throw new Error('Not valid ID')
    }

    try {
      const result = await service.getTaskById(id)

      if (result) {
        res.status(200).json({
          status: 'success',
          code: 200,
          data: result,
        })
      } else {
        res.status(404).json({
          status: 'error',
          code: 404,
          message: `Not found task id: ${id}`,
          data: 'Not Found',
        })
      }
    } catch (e) {
      console.error(e)
      next(e)
    }
  }

  update = async (req, res, next) => {
    const { id } = req.params
    const { title, text } = req.body
    try {
      const result = await service.updateTask(id, { title, text })
      if (result) {
        res.json({
          status: 'success',
          code: 200,
          data: { task: result },
        })
      } else {
        res.status(404).json({
          status: 'error',
          code: 404,
          message: `Not found task id: ${id}`,
          data: 'Not Found',
        })
      }
    } catch (e) {
      console.error(e)
      next(e)
    }
  }

  updateStatus = async (req, res, next) => {
    const { id } = req.params
    const { isDone = false } = req.body

    try {
      const result = await service.updateTask(id, { isDone })
      if (result) {
        res.json({
          status: 'success',
          code: 200,
          data: result,
        })
      } else {
        res.status(404).json({
          status: 'error',
          code: 404,
          message: `Not found task id: ${id}`,
          data: 'Not Found',
        })
      }
    } catch (e) {
      console.error(e)
      next(e)
    }
  }

  remove = async (req, res, next) => {
    const { id } = req.params

    try {
      const result = await service.removeTask(id)
      if (result) {
        res.json({
          status: 'success',
          code: 200,
          data: result,
        })
      } else {
        res.status(404).json({
          status: 'error',
          code: 404,
          message: `Not found task id: ${id}`,
          data: 'Not Found',
        })
      }
    } catch (e) {
      console.error(e)
      next(e)
    }
  }
}

module.exports = new TasksController()
