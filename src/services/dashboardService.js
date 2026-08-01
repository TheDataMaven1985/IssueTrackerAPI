const Project = require('../models/Project')

const Issue = require('../models/Issue')

const ApiError = require('../utils/ApiError')

const getDashboardStats = async ({ userId, issueId, status, priority }) => {
    const projects = await Project.find({
        $or: [{ owner: userId }, { members: userId }]
    })

    const totalProjects = projects.length

    const projectIds = projects.map(project => project._id)

    const totalIssues = await Issue.countDocuments({
        project: { $in: projectIds }
    })

    const completed = await Issue.countDocuments({
        project: { $in: projectIds },
        status: 'Done'
    })

    const pending = await Issue.countDocuments({
        project: { $in: projectIds },
        status: { $ne: 'Done' }
    })

    const highPriority = await Issue.countDocuments({
        project: { $in: projectIds },
        priority: 'High'
    })

    return { totalProjects, totalIssues, completed, pending, highPriority }
}

module.exports = { getDashboardStats }