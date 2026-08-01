const mongoose = require('mongoose')

const { Schema } = mongoose

const issueSchema = new Schema(
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
        project: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Project',
            required: true
        },
        reporter: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        assignee: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        status: {
            type: String,
            enum: ['Todo', 'In Progress', 'Review', 'Done'],
            default: 'Todo'
        },
        priority: {
            type: String,
            enum: ['Low', 'Medium', 'High', 'Critical'],
            default: 'Low'
        },
        labels: [String],
        dueDate: {
            type: Date
        }
    },
    { timestamps: true }
)

module.exports = mongoose.model('Issue', issueSchema)