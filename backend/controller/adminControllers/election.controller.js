const { ElectionService } = require("../../service/adminServices/election.service")

class ElectionController {
    async createElection(req, res) {
        await ElectionService.createElection({
            ...req.body,
            userId: req.userId
        })

        return res.status(200).json({
            message: "Election created successfully",
            success: true,
            error: false
        })
    }

    async viewElection(req, res) {
        const { results, total } = await ElectionService.viewElection({
            ...req.query,
            userId: req.userId
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

    async assignPosition(req, res) {
        await ElectionService.assignPosition({
            ...req.body,
            ...req.params
        })

        return res.status(200).json({
            message: "Position assigned successfully",
            success: true,
            error: false
        })
    }

    async getElectionPositions(req, res) {
        const response = await ElectionService.getElectionPositions({
            ...req.params,
            userId: req.userId
        })

        return res.status(200).json({
            message: "Election Positions",
            success: true,
            error: false,
            data: response,
        })
    }
}

module.exports = {
    ElectionController: new ElectionController()
}