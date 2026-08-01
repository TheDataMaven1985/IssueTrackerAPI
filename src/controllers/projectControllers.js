const { createProject, getAllProjects, getProjectById, updateProject, deleteProject } = require('../services/projectService')

const createNewProject = async (req, res, next) => {
    try {
        const { title, description, members, status } = req.body

        const ownerId = req.user.userId

        const newProject = await createProject({ title, description, members, status, ownerId })

        res.status(201).json({ success: true, data: newProject })
    } catch (err) {
        next(err)
    }
}

const getProjects = async (req, res, next) => {
    try {
        const userId = req.user.userId

        const projects = await getAllProjects({ userId })

        res.status(200).json({ success: true, data: projects })
    } catch (err) {
        next(err)
    }
}

const getProject = async (req, res, next) => {
    try {
        const projectId = req.params.id

        const userId = req.user.userId

        const project = await getProjectById({ projectId, userId })

        res.status(200).json({ success: true, data: project })
    } catch (err) {
        next(err)
    }
}

const projectUpdate = async (req, res, next) => {
    try {
        const projectId = req.params.id

        const userId = req.user.userId

        const updates = req.body

        const updatedProject = await updateProject({ projectId, userId, userRoles, updates })

        res.status(200).json({ success: true, data: updatedProject })
    } catch (err) {
        next(err)
    }
}

const projectDelete = async (req, res, next) => {
    try {
        const projectId = req.params.id

        const userId = req.user.userId

        const deletedProject = await deleteProject({ projectId, userId })

        res.status(200).json({ success: true, message: "Projected deleted successfully" })
    } catch (err) {
        next(err)
    }
}

module.exports = { createNewProject, getProjects, getProject, projectUpdate, projectDelete }