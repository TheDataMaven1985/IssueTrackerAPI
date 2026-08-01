const express = require('express')
const routes = express.Router({ mergeParams: true })

const authMiddleware = require('../middleware/authMiddleware')
const { createNewComment, getComments } = require('../controllers/commentControllers')

routes.post('/', authMiddleware, createNewComment)

routes.get('/', authMiddleware, getComments)

module.exports = routes
