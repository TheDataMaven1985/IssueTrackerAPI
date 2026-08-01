const Project = require('../models/Project')

const Issue = require('../models/Issue')

const ApiError = require('../utils/ApiError')

const createIssue = async ({ title, description, projectId, reporterId, assignee, priority, labels, dueDate }) => {
    const project = await Project.findById(projectId)

    if (!project) {
        throw new ApiError(404, 'Project not found')
    }

    const isOwner = project.owner.toString() === reporterId

    const isMember = project.members.some(memberId => memberId.toString() === reporterId)

    if (!isOwner && !isMember) {
        throw new ApiError(403, 'You do not have access to this project')
    }

    const issue = await Issue.create(
        {
            title,
            description,
            project: projectId,
            reporter: reporterId,
            assignee,
            priority,
            labels,
            dueDate
        }
    )

    return issue
}

const getAllIssues = async ({ userId, projectId, status, priority, assignee, search }) => {
    const projects = await Project.find({
        $or: [
            { owner: userId },
            { members: userId }
        ]
    })

    const projectIds = projects.map(project => project._id)
    const projectIdStrings = projectIds.map(id => id.toString())

    const filter = { project: { $in: projectIds } }

    if (projectId) {
        if (!projectIdStrings.includes(projectId.toString())) {
            throw new ApiError(403, "You do not have access to this project")
        }

        filter.project = projectId
    }

    if (status) filter.status = status
    if (priority) filter.priority = priority
    if (assignee) filter.assignee = assignee

    if (search) {
        filter.$or = [
            { title: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } }
        ]
    }

    const issues = await Issue.find(filter)

    return issues
}

const getIssueById = async ({ issueId, userId }) => {
    const issue = await Issue.findById(issueId).populate('reporter', 'username email').populate('assignee', 'username email')

    if (!issue) {
        throw new ApiError(404, 'Issue not found')
    }

    const parentProject = await Project.findById(issue.project)

    if (!parentProject) {
        throw new ApiError(404, 'Parent project not found')
    }

    const isOwner = parentProject.owner.toString() === userId
    const isMember = parentProject.members.some(memberId => memberId.toString() === userId)

    if (!isOwner && !isMember) {
        throw new ApiError(404, "Issue not found")
    }

    return issue
}

const updateIssue = async ({ issueId, userId, userRoles, updates }) => {
    const issue = await Issue.findById(issueId)

    if (!issue) {
        throw new ApiError(404, 'Issue not found')
    }

    const parentProject = await Project.findById(issue.project)

    if (!parentProject) {
        throw new ApiError(404, 'Parent project not found')
    }

    const isOwner = parentProject.owner.toString() === userId
    const isMember = parentProject.members.some(memberId => memberId.toString() === userId)

    if (!isOwner && !isMember) {
        throw new ApiError(403, 'You do not have access to this project')
    }

    if (updates.assignee !== undefined) {
        const canAssign = userRoles.some(role => ['Admin', 'Manager'].includes(role))
        if (!canAssign) {
            throw new ApiError(403, 'Only Admins and Managers can assign issues')
        }
    }

    Object.assign(issue, updates)
    await issue.save()

    return issue
}

const deleteIssue = async ({ issueId, userId }) => {
    // console.log('Looking for issue with ID:', issueId)

    const issue = await Issue.findById(issueId)

    // console.log('Found issue:', issue)

    if (!issue) {
        throw new ApiError(404, 'Issue not found')
    }

    const parentProject = await Project.findById(issue.project)

    if (!parentProject) {
        throw new ApiError(404, 'Parent project not found')
    }

    const isOwner = parentProject.owner.toString() === userId
    const isReporter = issue.reporter.toString() === userId

    if (!isOwner && !isReporter) {
        throw new ApiError(403, "You can't perform this command")
    }

    await issue.deleteOne()
}

module.exports = { createIssue, getAllIssues, getIssueById, updateIssue, deleteIssue }