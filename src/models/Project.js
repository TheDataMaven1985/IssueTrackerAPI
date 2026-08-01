const mongoose = require('mongoose')

const { Schema } = mongoose

const projectSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },
        description: {
            type: String,
            required: true,
            trim: true
        },
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        members: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            }
        ],
        status: {
            type: String,
            enum: ['Active', 'Completed', 'Archived'],
            default: 'Active'
        }
    },
    { timestamps: true }
)

module.exports = mongoose.model('Project', projectSchema)