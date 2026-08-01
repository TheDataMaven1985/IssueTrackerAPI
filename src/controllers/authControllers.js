const { registerUser, loginUser, refreshAccessToken, logoutUser } = require('../services/authServices');

const registerNewUser = async (req, res, next) => {
    try {
        const { username, email, password } = req.body

        const newUser = await registerUser({ username, email, password })

        res.status(201).json({ success: true, data: newUser })
    } catch (err) {
        next(err)
    }
}

const loginExitingUser = async (req, res, next) => {
    try {
        const { email, password } = req.body

        const { accessToken, refreshToken, roles } = await loginUser({ email, password })

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        res.status(200).json({ accessToken, roles })
    } catch (err) {
        next(err)
    }
}

const refreshAccessTokenController = async (req, res, next) => {
    try {
        // console.log('Cookie received:', req.cookies.refreshToken)
        const refreshToken = req.cookies.refreshToken

        const newAccessToken = await refreshAccessToken(refreshToken)

        res.status(200).json({ accessToken: newAccessToken })
    } catch (err) {
        next(err)
    }
}

const logoutUserController = async (req, res, next) => {
    try {
        const refreshToken = req.cookies.refreshToken

        const logoutUserToken = await logoutUser(refreshToken)

        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        res.status(200).json({ message: "Logged out successfully" })
    } catch (err) {
        next(err)
    }
}

module.exports = { registerNewUser, loginExitingUser, refreshAccessTokenController, logoutUserController }