require('dotenv').config()

const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const User = require('../models/User')

const ApiError = require('../utils/ApiError')

const registerUser = async ({ username, email, password }) => {
    const hashedPassword = await bcrypt.hash(password, 10)
    try {
        const createUser = await User.create({
            username,
            email,
            password: hashedPassword
        })

        const userObject = createUser.toObject()
        delete userObject.password
        return userObject

    } catch (err) {
        if (err.code === 11000) {
            throw new ApiError(409, 'Username or email already in use')
        }
        throw err
    }
}

const loginUser = async ({ email, password }) => {
    const foundUser = await User.findOne({ email })

    if (!foundUser) {
        throw new ApiError(401, 'Invalid Credentials')
    }

    const match = await bcrypt.compare(password, foundUser.password)

    if (!match) {
        throw new ApiError(401, 'Invalid Credentials')
    }

    // console.log('SIGNING with secret:', JSON.stringify(process.env.JWT_ACCESS_TOKEN))
    const accessToken = jwt.sign(
        { userId: foundUser._id, roles: foundUser.roles },
        process.env.JWT_ACCESS_TOKEN,
        { expiresIn: process.env.JWT_ACCESS_EXPIRY }
    )
    // console.log('Generated token:', accessToken)

    const refreshToken = jwt.sign(
        { userId: foundUser._id, roles: foundUser.roles },
        process.env.JWT_REFRESH_TOKEN,
        { expiresIn: process.env.JWT_REFRESH_EXPIRY }
    )

    foundUser.refreshToken = refreshToken
    await foundUser.save()

    return { accessToken, refreshToken, roles: foundUser.roles }
}

const refreshAccessToken = async (refreshToken) => {
    if (!refreshToken) {
        throw new ApiError(401, "No refresh token provided")
    }

    let decoded
    try {
        decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_TOKEN)
        console.log('Decoded token:', decoded)
    } catch (err) {
        // console.log('jwt.verify failed:', err.message)
        throw new ApiError(403, "Invalid or expired refresh token")
    }

    const foundUser = await User.findById(decoded.userId)
    // cconsole.log('Found user refreshToken in DB:', foundUser?.refreshToken)
    // onsole.log('Incoming cookie refreshToken:', refreshToken)

    if (!foundUser || foundUser.refreshToken !== refreshToken) {
        // console.log('Mismatch or no user found')
        throw new ApiError(403, "Invalid or expired refresh token")
    }

    const accessToken = jwt.sign(
        { userId: foundUser._id, roles: foundUser.roles },
        process.env.JWT_ACCESS_TOKEN,
        { expiresIn: process.env.JWT_ACCESS_EXPIRY }
    )

    return accessToken
}

const logoutUser = async (refreshToken) => {
    if (!refreshToken) {
        return
    }

    const foundUser = await User.findOne({ refreshToken })

    if (!foundUser) {
        return
    }

    foundUser.refreshToken = ''
    await foundUser.save()
}

module.exports = {
    registerUser,
    loginUser,
    refreshAccessToken,
    logoutUser
}