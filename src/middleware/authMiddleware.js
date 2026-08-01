const jwt = require('jsonwebtoken')
const ApiError = require('../utils/ApiError')

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return next(new ApiError(401, 'No token provided'))
    }

    const token = authHeader.split(' ')[1]

    try {
        // console.log('VERIFYING with secret:', JSON.stringify(process.env.JWT_ACCESS_TOKEN))
        // console.log('Token received:', JSON.stringify(token))
        const decoded = jwt.verify(token, process.env.JWT_ACCESS_TOKEN)
        req.user = decoded
        next()
    } catch (err) {
        return next(new ApiError(403, 'Invalid or expired token'))
    }
}

module.exports = authMiddleware