const Project = require('../models/Project')
const Issue = require('../models/Issue')
const Comment = require('../models/Comment')

const ApiError = require('../utils/ApiError')

const createComment = async ({ issueId, authorId, message }) => {
    const issue = await Issue.findById(issueId)

    if (!issue) {
        throw new ApiError(404, 'Issue not found')
    }

    const parentProject = await Project.findById(issue.project)

    if (!parentProject) {
        throw new ApiError(404, 'Parent project not found')
    }

    const isOwner = parentProject.owner.toString() === authorId
    const isMember = parentProject.members.toString() === authorId

    if (!isOwner && !isMember) {
        throw new ApiError(403, 'You don not have access to this project')
    }

    const comment = await Comment.create(
        {
            issue: issueId,
            author: authorId,
            message
        }
    )

    return comment
}

const getCommentsForIssue = async ({ issueId, userId }) => {
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

    const comment = await Comment.find({ issue: issueId }).populate('author', 'username email')

    return comment
}

const deleteComment = async ({ commentId, userId }) => {
    const comment = await Comment.findById(commentId)

    if (!comment) {
        throw new ApiError(404, 'Comment does not exist')
    }

    const issue = await Issue.findById(comment.issue)
    const parentProject = await Project.findById(issue.project)

    if (!parentProject) {
        throw new ApiError(404, 'Parent project not found')
    }

    const isOwner = parentProject.owner.toString() === userId
    const isAuthor = comment.author.toString() === userId

    if (!isOwner && !isAuthor) {
        throw new ApiError(403, "You can't perform this command")
    }

    await comment.deleteOne()
}

module.exports = { createComment, getCommentsForIssue, deleteComment }