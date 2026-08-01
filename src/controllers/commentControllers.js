const { createComment, getCommentsForIssue, deleteComment } = require('../services/commentService')

const createNewComment = async (req, res, next) => {
    try {
        const { message } = req.body

        const issueId = req.params.id

        const authorId = req.user.userId

        const newComment = await createComment({ issueId, authorId, message })

        res.status(201).json({ success: true, data: newComment })
    } catch (err) {
        next(err)
    }
}

const getComments = async (req, res, next) => {
    try {
        const issueId = req.params.id

        const userId = req.user.userId

        const comments = await getCommentsForIssue({ issueId, userId })

        res.status(200).json({ success: true, data: comments })
    } catch (err) {
        next(err)
    }
}

const commentDelete = async (req, res, next) => {
    try {
        const commentId = req.params.id

        const userId = req.user.userId

        const deletedComment = await deleteComment({ commentId, userId })

        res.status(200).json({ success: true, message: 'Comment deleted successfully' })
    } catch (err) {
        next(err)
    }
}

module.exports = { createNewComment, getComments, commentDelete }