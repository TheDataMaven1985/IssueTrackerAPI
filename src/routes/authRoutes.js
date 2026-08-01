const express = require('express')
const routes = express.Router()

const { registerNewUser, loginExitingUser, refreshAccessTokenController, logoutUserController } = require('../controllers/authControllers')

routes.post('/register', registerNewUser)

routes.post('/login', loginExitingUser)

routes.post('/refresh', refreshAccessTokenController)

routes.post('/logout', logoutUserController)

module.exports = routes