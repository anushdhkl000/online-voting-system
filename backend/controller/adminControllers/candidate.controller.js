const { candidateSchema, groupCandidateSchema } = require("../../formSchema/candidate.schema")
const { CandidateService } = require("../../service/adminServices/candidate.service")

class candidateController {
    async createCandidate(req, res) {
        if (req.body.candidateType === "individual") {
            const payload = req.body;
            const validated = await candidateSchema.validateAsync(payload);
            req.body = validated;
        }
        if (req.body.candidateType === "group") {
            const payload = req.body;
            const validated = await groupCandidateSchema.validateAsync(payload);
            req.body = validated;
            req.body.group = true
        }
        await CandidateService.createCandidate({
            ...req.body,
            ...req.files,
            userIds: req.userId
        })

        return res.status(200).json({
            message: "Candidate created successfully",
            success: true,
            error: false
        })
    }

    async viewCandidate(req, res) {
        const { results, total, hasNextPage, currentPage, electionPosition } = await CandidateService.viewCandidate({
            ...req.query,
            userId: req.userId
        })

        return res.status(200).json({
            message: "Candidate List",
            success: true,
            error: false,
            data: results,
            total,
            hasNextPage,
            currentPage,
            electionPosition
        })
    }

    async updateCandidate(req, res) {
        await CandidateService.updateCandidate({
            ...req.body,
            ...req.files,
            ...req.params
        })

        return res.status(200).json({
            message: "Candidate updated successfully",
            success: true,
            error: false
        })
    }

    async deleteCandidate(req, res) {
        await CandidateService.deleteCandidate({
            ...req.params
        })

        return res.status(200).json({
            message: "Candidate deleted successfully",
            success: true,
            error: false
        })
    }
}
module.exports = {
    candidateController: new candidateController()
}