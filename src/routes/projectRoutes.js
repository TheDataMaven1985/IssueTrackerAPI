const express = require('express')
const routes = express.Router()

const authMiddleware = require('../middleware/authMiddleware')

const roleMiddleware = require('../middleware/roleMiddleware')

const { createNewProject, getProjects, getProject, projectUpdate, projectDelete } = require('../controllers/projectControllers')

routes.post('/', authMiddleware, roleMiddleware('Admin', 'Manager'), createNewProject)

routes.get('/', authMiddleware, getProjects)

routes.get('/:id', authMiddleware, getProject)

routes.patch('/:id', authMiddleware, projectUpdate)

routes.delete('/:id', authMiddleware, roleMiddleware('Admin'), projectDelete)

module.exports = routes