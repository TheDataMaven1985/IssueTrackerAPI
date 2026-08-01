const mongoose = require('mongoose')

const { Schema } = mongoose

const commentSchema = new Schema(
    {
        issue: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Issue',
            required: true
        },
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        message: {
            type: String,
            required: true,
            trim: true
        }
    },
    { timestamps: { createdAt: true, updatedAt: false } }
)

module.exports = mongoose.model('Comment', commentSchema)