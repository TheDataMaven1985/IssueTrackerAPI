const ApiError = require('../utils/ApiError')

const requireRole = (...allowedRoles) => {
    return (req, res, next) => {
        const userRoles = req.user.roles

        const hasPermission = userRoles.some(role => allowedRoles.includes(role))

        if (!hasPermission) {
            return next(new ApiError(403, 'You do not have access to perform this action'))
        }

        next()
    }
}

module.exports = requireRole