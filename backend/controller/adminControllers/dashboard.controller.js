const { DashboardService } = require("../../service/dashboard.service")

class DashboardController {

    async getDashboard(req, res) {
        const response = await DashboardService.getDashboard({ userId: req.userId })

        return res.status(200).json({
            message: "Dashboard List",
            success: true,
            error: false,
            data: response
        })
    }
}

module.exports = {
    DashboardController: new DashboardController()
}