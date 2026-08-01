const User = require('../models/User')

const ApiError = require('../utils/ApiError')

const getUserProfile = async (userId) => {
    const user = await User.findById(userId)

    if (!user) {
        throw new ApiError(404, 'User not found')
    }

    const userObject = user.toObject()
    delete userObject.password
    return userObject
}

module.exports = { getUserProfile }