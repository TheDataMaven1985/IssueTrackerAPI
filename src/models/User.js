const mongoose = require('mongoose')

const { Schema } = mongoose

const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true
        },
        password: {
            type: String,
            required: true
        },
        roles: {
            type: [String],
            default: ['Developer']
        },
        refreshToken: {
            type: String
        },
    },
    { timestamps: true }
)

module.exports = mongoose.model('User', userSchema)