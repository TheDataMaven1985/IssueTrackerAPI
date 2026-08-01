const express = require('express')
const routes = express.Router()

const authMiddleware = require('../middleware/authMiddleware')
const { getProfile } = require('../controllers/userControllers')

routes.get('/profile', authMiddleware, getProfile)

module.exports = routes