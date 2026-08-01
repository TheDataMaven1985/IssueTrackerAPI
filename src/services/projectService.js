const Project = require('../models/Project')

const ApiError = require('../utils/ApiError')

const createProject = async ({ title, description, members, status, ownerId }) => {
    const project = await Project.create({
        title,
        description,
        owner: ownerId,
        members,
        status
    })

    return project
}

const getAllProjects = async ({ userId }) => {
    const projects = await Project.find({
        $or: [
            { owner: userId },
            { members: userId }
        ]
    })
        .populate('owner', 'username email')
        .populate('members', 'username email')

    return projects
}

const getProjectById = async ({ projectId, userId }) => {
    const project = await Project.findById(projectId).populate('owner', 'username email').populate('members', 'username email')

    if (!project) {
        throw new ApiError(404, 'Project Not found')
    }

    const isOwner = project.owner._id.toString() === userId

    const isMember = project.members.some(member => member._id.toString() === userId)

    if (!isOwner && !isMember) {
        throw new ApiError(404, "Project not found")
    }

    return project
}

const updateProject = async ({ projectId, userId, updates }) => {
    const project = await Project.findById(projectId)

    if (!project) {
        throw new ApiError(404, 'Project not found')
    }

    const isOwner = project.owner.toString() === userId

    const isMember = project.members.some(memberId => memberId.toString() === userId)

    if (!isOwner && !isMember) {
        throw new ApiError(404, "Project not found")
    }

    Object.assign(project, updates)
    await project.save()

    return project
}

const deleteProject = async ({ projectId, userId }) => {
    const project = await Project.findById(projectId)

    if (!project) {
        throw new ApiError(404, 'Project not found')
    }

    const isOwner = project.owner.toString() === userId

    if (!isOwner) {
        throw new ApiError(403, "Can't perform this command")
    }

    await project.deleteOne()
}

module.exports = { createProject, getAllProjects, getProjectById, updateProject, deleteProject }