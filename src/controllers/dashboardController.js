const { getDashboardStats } = require('../services/dashboardService')

const getDashboard = async (req, res, next) => {
    try {
        const userId = req.user.userId

        const stats = await getDashboardStats({ userId })

        res.status(200).json(stats)
    } catch (err) {
        next(err)
    }
}

module.exports = { getDashboard }