const { getUserProfile } = require('../services/userService')

const getProfile = async (req, res, next) => {
    try {
        const userId = req.user.userId

        const user = await getUserProfile(userId)

        res.status(200).json({ success: true, data: user })
    } catch (err) {
        next(err)
    }
}

module.exports = { getProfile }