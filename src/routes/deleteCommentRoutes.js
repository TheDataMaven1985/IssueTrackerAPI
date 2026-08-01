const express = require('express')
const routes = express.Router()

const authMiddleware = require('../middleware/authMiddleware')
const { commentDelete } = require('../controllers/commentControllers')

routes.delete('/:id', authMiddleware, commentDelete)

module.exports = routes