const { createIssue, getAllIssues, getIssueById, updateIssue, deleteIssue } = require('../services/issueServices')

const createNewIssue = async (req, res, next) => {
    try {
        const { title, description, projectId, assignee, priority, labels, dueDate } = req.body

        const reporterId = req.user.userId

        const newIssue = await createIssue({ title, description, projectId, reporterId, assignee, priority, labels, dueDate })

        res.status(201).json({ success: true, data: newIssue })
    } catch (err) {
        next(err)
    }
}

const getIssues = async (req, res, next) => {
    try {
        const userId = req.user.userId

        const projectId = req.query.project

        const { status, priority, assignee, search } = req.query

        const issues = await getAllIssues({ userId, projectId, status, priority, assignee, search })

        res.status(200).json({ success: true, data: issues })
    } catch (err) {
        next(err)
    }
}

const getIssue = async (req, res, next) => {
    try {
        const issueId = req.params.id

        const userId = req.user.userId

        const issue = await getIssueById({ issueId, userId })

        res.status(200).json({ success: true, data: issue })
    } catch (err) {
        next(err)
    }
}

const issueUpdate = async (req, res, next) => {
    try {
        const issueId = req.params.id

        const userId = req.user.userId

        const userRoles = req.user.roles

        const updates = req.body

        const updatedIssue = await updateIssue({ issueId, userId, userRoles, updates })

        res.status(200).json({ success: true, data: updatedIssue })
    } catch (err) {
        next(err)
    }
}

const issueDelete = async (req, res, next) => {
    try {
        const issueId = req.params.id

        const userId = req.user.userId

        const deletedIssue = await deleteIssue({ issueId, userId })

        res.status(200).json({ success: true, message: 'Issue deleted succesfully' })
    } catch (err) {
        next(err)
    }
}

module.exports = { createNewIssue, getIssues, getIssue, issueUpdate, issueDelete }