const express = require('express')
const routes = express.Router()

const authMiddleware = require('../middleware/authMiddleware')

const { getDashboard } = require('../controllers/dashboardController')

routes.get('/', authMiddleware, getDashboard)

module.exports = routes