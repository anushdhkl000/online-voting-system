const { UserService } = require("../../service/UserServices/user.service")

class UserController {

    async getAll(req, res) {
        const response = await UserService.getAll({ userId: req.userId })

        res.status(200).json({
            message: "success",
            success: true,
            error: false,
            response
        })
    }

    async getAllElection(req, res) {
        const responses = await UserService.getAllElection({ userId: req.userId })

        res.status(200).json({
            message: "success",
            success: true,
            error: false,
            responses
        })
    }

    async getCandidateByElectionId(req, res) {
        const { electionId } = req.params
        const { positionId } = req.query

        const response = await UserService.getCandidateByElectionId({ electionId, positionId })

        res.status(200).json({
            message: "success",
            success: true,
            error: false,
            response
        })
    }

    async generateVotingToken(req, res) {
        const token = await UserService.generateVotingToken({
            ...req.body
        })

        res.status(200).json({
            message: "success",
            success: true,
            error: false,
            token
        })
    }

    async castingVote(req, res) {
        const response = await UserService.castingVote({
            ...req.body,
            userId: req.userId
        })

        res.status(200).json({
            message: "success",
            success: true,
            error: false,
            response
        })
    }

    async getAllElectionResults(req, res) {
        const response = await UserService.getAllElectionResults({
            userId: req.userId
        })

        res.status(200).json({
            message: "success",
            success: true,
            error: false,
            response
        })
    }

    async trackVote(req, res) {
        const response = await UserService.trackVote({
            ...req.body,
            userId: req.userId
        })

        res.status(200).json({
            message: "success",
            success: true,
            error: false,
            response
        })
    }
}

module.exports = {
    UserController: new UserController()
}