const { ElectionService } = require("../../service/adminServices/election.service")

class ElectionController {
    async createElection(req, res) {
        await ElectionService.createElection({
            ...req.body
        })

        return res.status(200).json({
            message: "Election created successfully",
            success: true,
            error: false
        })
    }

    async viewElection(req, res) {
        const { results, total } = await ElectionService.viewElection({
            ...req.query
        })

        return res.status(200).json({
            message: "Election List",
            success: true,
            error: false,
            data: results,
            total
        })
    }

    async updateElection(req, res) {
        await ElectionService.updateElection({
            ...req.body,
            ...req.params
        })

        return res.status(200).json({
            message: "Election updated successfully",
            success: true,
            error: false
        })
    }

    async deleteElection(req, res) {
        await ElectionService.deleteElection({
            ...req.params
        })

        return res.status(200).json({
            message: "Election deleted successfully",
            success: true,
            error: false
        })
    }
}

module.exports = {
    ElectionController: new ElectionController()
}