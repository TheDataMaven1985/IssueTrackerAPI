const express = require('express')
const routes = express.Router()

const authMiddleware = require('../middleware/authMiddleware')

const roleMiddleware = require('../middleware/roleMiddleware')

const { createNewIssue, getIssues, getIssue, issueUpdate, issueDelete } = require('../controllers/issueControllers')

routes.post('/', authMiddleware, createNewIssue)

routes.get('/', authMiddleware, getIssues)

routes.get('/:id', authMiddleware, getIssue)

routes.patch('/:id', authMiddleware, issueUpdate)

routes.delete('/:id', authMiddleware, roleMiddleware('Admin', 'Manager'), issueDelete)

module.exports = routes