const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const cookieParser = require('cookie-parser')

const errorHandler = require('./middleware/errorHandler')
const notFound = require('./middleware/notFound')
const ApiError = require('./utils/ApiError')

const authRoutes = require('./routes/authRoutes')

const userRoutes = require('./routes/userRoutes')
const projectRoutes = require('./routes/projectRoutes')
const issueRoutes = require('./routes/issueRoutes')

const commentRoutes = require('./routes/commentRoutes')
const deletecommentRoutes = require('./routes/deleteCommentRoutes')

const dashboardRoutes = require('./routes/dashboardRoutes')

const app = express()

app.use(cors())
app.use(morgan('dev'))
app.use(express.json())
app.use(cookieParser())

// Create Temporary Health Check
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' })
})

app.get('/test-error', (req, res, next) => {
    next(new ApiError(400, 'This is a test error'))
})


app.use('/auth', authRoutes)

app.use('/users', userRoutes)

app.use('/projects', projectRoutes)

app.use('/issues', issueRoutes)

app.use('/:id/comments', commentRoutes)

app.use('/comments', deletecommentRoutes)

app.use('/dashboard', dashboardRoutes)

// middleware functions
app.use(notFound)
app.use(errorHandler)

module.exports = app